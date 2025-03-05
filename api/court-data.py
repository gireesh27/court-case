from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, validator
import requests
from bs4 import BeautifulSoup
import re
import io
import base64
import json
import time
import random
from typing import Dict, List, Optional, Union, Any
from datetime import datetime

# For CAPTCHA handling
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import cv2
import numpy as np
from enum import Enum
import os
import uuid
import databutton as db  # For storing failed CAPTCHAs for analysis

# Create API Router
router = APIRouter(prefix="/court-data", tags=["court-data"])

# Input model for court case search
class CaseSearchRequest(BaseModel):
    courtName: str = Field(..., description="Name of the court")
    caseType: str = Field(..., description="Type of the case")
    caseNumber: str = Field(..., description="Case number")
    caseYear: str = Field(..., description="Year of the case")
    
    @validator('caseNumber')
    def validate_case_number(cls, v):
        if not v.isdigit():
            raise ValueError('Case number must contain only digits')
        return v
    
    @validator('caseYear')
    def validate_case_year(cls, v):
        if not v.isdigit() or len(v) != 4:
            raise ValueError('Case year must be a 4-digit year')
        year = int(v)
        current_year = datetime.now().year
        if year < 1900 or year > current_year:
            raise ValueError(f'Year must be between 1900 and {current_year}')
        return v

# Models for response
class Hearing(BaseModel):
    date: str
    time: str
    purpose: str
    courtroom: str
    status: str

class Order(BaseModel):
    date: str
    type: str
    description: str
    issuedBy: str

class Judgment(BaseModel):
    date: str
    type: str
    summary: str
    issuedBy: str

class CaseInfo(BaseModel):
    caseNumber: str
    caseYear: str
    courtName: str
    caseType: str
    filingDate: str
    status: str
    plaintiff: str
    defendant: str
    judge: str

class CaseDetailsResponse(BaseModel):
    caseInfo: CaseInfo
    hearings: List[Hearing]
    orders: List[Order]
    judgments: List[Judgment]
    nextHearingDate: Optional[str] = None

# API Endpoint for court case search
# Test endpoint for CAPTCHA solving
@router.post("/test-captcha", tags=["captcha"])
async def test_captcha_solver(captcha_url: str = None):
    """Test the CAPTCHA solver with a given URL or example CAPTCHA"""
    try:
        solver = CaptchaSolver()
        
        if captcha_url:
            # Fetch the captcha from the provided URL
            session = requests.Session()
            response = session.get(captcha_url, timeout=10)
            response.raise_for_status()
            captcha_image = response.content
        else:
            # Use a sample CAPTCHA image for testing
            # In a real implementation, you should store some sample CAPTCHAs
            # for testing purposes
            return {"error": "Please provide a captcha_url parameter"}
        
        # Solve the CAPTCHA
        result = solver.solve_captcha(captcha_image)
        
        # Get solving statistics
        stats = solver.get_statistics()
        
        return {
            "success": bool(result),
            "result": result,
            "statistics": stats
        }
    except Exception as e:
        return {"error": str(e)}

@router.post("/search", response_model=CaseDetailsResponse)
async def search_case(request: CaseSearchRequest):
    try:
        # Log the search request
        print(f"Searching for case: {request.caseNumber}/{request.caseYear} in {request.courtName} ({request.caseType})")
        
        # TODO: In a production environment, this would use the actual scraper
        # For now, we'll continue to return mock data as we need the real Northeast court portal URL
        # and structure for the complete implementation
        
        # Uncomment this code when ready to use the actual scraper:
        # scraper = CourtPortalScraper()
        # result = scraper.search_case(
        #    request.courtName,
        #    request.caseType,
        #    request.caseNumber,
        #    request.caseYear
        # )
        # 
        # return CaseDetailsResponse(**result)
        
        # Mock delay to simulate network request
        time.sleep(1)
        
        # For now, return mock data
        return CaseDetailsResponse(
            caseInfo=CaseInfo(
                caseNumber=request.caseNumber,
                caseYear=request.caseYear,
                courtName=request.courtName,
                caseType=request.caseType,
                filingDate="2023-05-15",  # Mock date
                status="Active",
                plaintiff="John Doe",
                defendant="XYZ Corporation",
                judge="Hon. Robert Smith",
            ),
            hearings=[
                Hearing(
                    date="2023-08-10",
                    time="10:00 AM",
                    purpose="Initial Hearing",
                    courtroom="Courtroom 3B",
                    status="Completed",
                ),
                Hearing(
                    date="2023-10-22",
                    time="11:30 AM",
                    purpose="Evidence Submission",
                    courtroom="Courtroom 2A",
                    status="Completed",
                ),
                Hearing(
                    date="2024-01-15",
                    time="09:30 AM",
                    purpose="Witness Testimony",
                    courtroom="Courtroom 5C",
                    status="Completed",
                ),
                Hearing(
                    date="2025-04-15",
                    time="10:30 AM",
                    purpose="Final Arguments",
                    courtroom="Courtroom 1A",
                    status="Scheduled",
                ),
            ],
            orders=[
                Order(
                    date="2023-08-15",
                    type="Procedural Order",
                    description="Case management timeline established",
                    issuedBy="Hon. Robert Smith",
                ),
                Order(
                    date="2023-11-02",
                    type="Interim Order",
                    description="Temporary injunction granted",
                    issuedBy="Hon. Robert Smith",
                ),
                Order(
                    date="2024-01-20",
                    type="Disclosure Order",
                    description="Defendant ordered to submit additional documentation",
                    issuedBy="Hon. Robert Smith",
                ),
            ],
            judgments=[],
            nextHearingDate="2025-04-15",
        )
        
    except Exception as e:
        # Log the error
        print(f"Error searching for case: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve case information: {str(e)}"
        )


# Define preprocessing strategies for CAPTCHA images
class PreprocessingStrategy(Enum):
    BASIC = "basic"                  # Basic grayscale + threshold
    CONTRAST_ENHANCEMENT = "contrast"  # Increase contrast before processing
    NOISE_REDUCTION = "noise"        # Apply noise reduction filters
    CHARACTER_SEGMENTATION = "segment"  # Try to segment characters
    ADAPTIVE_THRESHOLD = "adaptive"  # Use adaptive thresholding
    MORPHOLOGICAL = "morphological"  # Apply morphological operations

# Model for CAPTCHA extraction result
class CaptchaExtractionResult:
    def __init__(self, image, url="", page_title="", page_url=""):
        self.image = image
        self.url = url
        self.page_title = page_title
        self.page_url = page_url

# CAPTCHA Solving Logic
class CaptchaSolver:
    def __init__(self):
        # Initialize OCR settings
        self.max_retries = 3
        self.preprocessing_strategies = [
            PreprocessingStrategy.BASIC,
            PreprocessingStrategy.CONTRAST_ENHANCEMENT,
            PreprocessingStrategy.ADAPTIVE_THRESHOLD,
            PreprocessingStrategy.MORPHOLOGICAL,
            PreprocessingStrategy.NOISE_REDUCTION,
            PreprocessingStrategy.CHARACTER_SEGMENTATION
        ]
        
        # Additional settings for OCR
        self.psm_options = [8, 7, 6, 13]  # Different page segmentation modes to try
        self.oem_options = [3, 1]  # Different OCR Engine modes
        
        # Statistics for debugging and improvement
        self.success_count = 0
        self.failure_count = 0
        self.strategy_success = {strategy: 0 for strategy in self.preprocessing_strategies}
        
    def solve_captcha(self, captcha_image, save_failures=True):
        """
        Solve the CAPTCHA using OCR techniques with multiple strategies
        
        Args:
            captcha_image: The captcha image as bytes, base64 string, or PIL Image
            save_failures: Whether to save failed captchas for analysis
            
        Returns:
            str: The solved captcha text
        """
        try:
            # Convert image to format suitable for OCR
            image = self._convert_to_pil_image(captcha_image)
            if not image:
                return ""
                
            # Save original image for debugging if needed
            original_image = image.copy()
            
            # Try different preprocessing strategies and OCR configurations until one works
            all_results = []
            
            # Try each preprocessing strategy
            for strategy in self.preprocessing_strategies:
                try:
                    # Apply the preprocessing strategy
                    processed_image = self._preprocess_image(image, strategy)
                    if processed_image is None:
                        continue
                    
                    # Try different OCR configurations
                    for psm in self.psm_options:
                        for oem in self.oem_options:
                            try:
                                # Configure OCR parameters
                                config = f'--oem {oem} --psm {psm} -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                                
                                # Perform OCR
                                text = pytesseract.image_to_string(processed_image, config=config).strip()
                                
                                # Clean up the text
                                text = text.replace(" ", "").replace("\n", "").strip()
                                
                                # Check if we got something reasonable
                                if text and len(text) >= 4 and text.isalnum():
                                    # Log the successful strategy
                                    self.success_count += 1
                                    self.strategy_success[strategy] += 1
                                    print(f"CAPTCHA solved successfully using strategy: {strategy.value}, psm: {psm}, oem: {oem}")
                                    return text
                                
                                # Save the result
                                if text:
                                    all_results.append((text, strategy, psm, oem))
                            except Exception as e:
                                print(f"Error in OCR with strategy {strategy.value}, PSM {psm}, OEM {oem}: {str(e)}")
                                continue
                except Exception as e:
                    print(f"Error applying preprocessing strategy {strategy.value}: {str(e)}")
                    continue
            
            # If all strategies failed but we have some results, use the most common one
            if all_results:
                # Group by text and count occurrences
                text_counts = {}
                for text, _, _, _ in all_results:
                    text_counts[text] = text_counts.get(text, 0) + 1
                
                # Get the most common text
                most_common_text = max(text_counts.items(), key=lambda x: x[1])[0]
                if most_common_text:
                    print(f"Using most common OCR result: {most_common_text}")
                    return most_common_text
            
            # If we get here, all strategies failed
            self.failure_count += 1
            
            # Save the failed captcha for analysis if requested
            if save_failures:
                self._save_failed_captcha(original_image)
            
            return ""
            
        except Exception as e:
            print(f"Critical error solving captcha: {str(e)}")
            self.failure_count += 1
            return ""
    
    def _convert_to_pil_image(self, captcha_image):
        """Convert various image formats to PIL Image"""
        try:
            if isinstance(captcha_image, str) and captcha_image.startswith('data:image'):
                # Handle base64 image
                image_data = base64.b64decode(captcha_image.split(',')[1])
                return Image.open(io.BytesIO(image_data))
            elif isinstance(captcha_image, bytes):
                # Handle bytes
                return Image.open(io.BytesIO(captcha_image))
            elif isinstance(captcha_image, Image.Image):
                # Handle PIL Image
                return captcha_image
            elif isinstance(captcha_image, np.ndarray):
                # Handle numpy array (OpenCV image)
                return Image.fromarray(captcha_image)
            else:
                print(f"Unsupported image type: {type(captcha_image)}")
                return None
        except Exception as e:
            print(f"Error converting image: {str(e)}")
            return None
    
    def _preprocess_image(self, image, strategy):
        """Apply various preprocessing strategies to the image"""
        try:
            # Convert to OpenCV format if needed
            if isinstance(image, Image.Image):
                cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            else:
                cv_image = image
            
            # Convert to grayscale (common for all strategies)
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY) if len(cv_image.shape) > 2 else cv_image
            
            # Apply specific strategy
            if strategy == PreprocessingStrategy.BASIC:
                # Basic binary threshold
                _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
                return Image.fromarray(thresh)
                
            elif strategy == PreprocessingStrategy.CONTRAST_ENHANCEMENT:
                # Enhance contrast using PIL
                pil_image = Image.fromarray(gray)
                enhancer = ImageEnhance.Contrast(pil_image)
                enhanced = enhancer.enhance(2.0)  # Increase contrast by factor of 2
                # Then apply threshold
                enhanced_array = np.array(enhanced)
                _, thresh = cv2.threshold(enhanced_array, 150, 255, cv2.THRESH_BINARY_INV)
                return Image.fromarray(thresh)
                
            elif strategy == PreprocessingStrategy.NOISE_REDUCTION:
                # Apply blur to reduce noise, then threshold
                denoised = cv2.GaussianBlur(gray, (3, 3), 0)
                _, thresh = cv2.threshold(denoised, 150, 255, cv2.THRESH_BINARY_INV)
                # Apply morphological operations to remove small noise
                kernel = np.ones((2, 2), np.uint8)
                cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
                return Image.fromarray(cleaned)
                
            elif strategy == PreprocessingStrategy.CHARACTER_SEGMENTATION:
                # Try to segment characters for better recognition
                # First apply threshold to get a binary image
                _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
                
                # Find contours (potential characters)
                contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                # If we found at least some contours, create a clean image with only the characters
                if len(contours) > 0:
                    # Create a blank image (white background)
                    result = np.ones_like(gray) * 255
                    
                    # Filter contours by size (to eliminate noise)
                    min_area = 50  # Adjust based on captcha characteristics
                    filtered_contours = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area]
                    
                    # Draw only the character contours
                    cv2.drawContours(result, filtered_contours, -1, (0), thickness=cv2.FILLED)
                    
                    return Image.fromarray(result)
                else:
                    # Fallback to basic if no contours found
                    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
                    return Image.fromarray(thresh)
                    
            elif strategy == PreprocessingStrategy.ADAPTIVE_THRESHOLD:
                # Use adaptive threshold to account for different lighting conditions
                adaptive_thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                                     cv2.THRESH_BINARY_INV, 11, 2)
                # Clean up with morphology
                kernel = np.ones((2, 2), np.uint8)
                cleaned = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_OPEN, kernel)
                return Image.fromarray(cleaned)
                
            elif strategy == PreprocessingStrategy.MORPHOLOGICAL:
                # Apply morphological transformations
                # First get binary image
                _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
                
                # Apply dilation followed by erosion to close gaps in characters
                kernel = np.ones((2, 2), np.uint8)
                dilation = cv2.dilate(binary, kernel, iterations=1)
                closing = cv2.erode(dilation, kernel, iterations=1)
                
                # Apply opening to remove small noise
                opening = cv2.morphologyEx(closing, cv2.MORPH_OPEN, kernel)
                return Image.fromarray(opening)
            
            # Default fallback
            return Image.fromarray(gray)
            
        except Exception as e:
            print(f"Error in preprocessing strategy {strategy.value}: {str(e)}")
            return None
    
    def _save_failed_captcha(self, image):
        """Save failed captchas for later analysis"""
        try:
            # Generate a unique ID for this captcha
            captcha_id = f"failed_captcha_{uuid.uuid4().hex[:8]}_{int(time.time())}.png"
            
            # Convert to bytes
            img_bytes = io.BytesIO()
            image.save(img_bytes, format='PNG')
            img_bytes.seek(0)
            
            # Save to databutton storage for analysis
            db.storage.binary.put(captcha_id, img_bytes.getvalue())
            
            print(f"Saved failed captcha as {captcha_id} for analysis")
        except Exception as e:
            print(f"Error saving failed captcha: {str(e)}")
    
    def get_statistics(self):
        """Get statistics about captcha solving performance"""
        total = self.success_count + self.failure_count
        success_rate = (self.success_count / total) * 100 if total > 0 else 0
        
        strategy_stats = {}
        for strategy in self.preprocessing_strategies:
            strategy_stats[strategy.value] = {
                "count": self.strategy_success[strategy],
                "rate": (self.strategy_success[strategy] / self.success_count) * 100 if self.success_count > 0 else 0
            }
            
        return {
            "total_attempts": total,
            "successes": self.success_count,
            "failures": self.failure_count,
            "success_rate": success_rate,
            "strategy_stats": strategy_stats
        }


# Court Portal Scraper
class CourtPortalScraper:
    def __init__(self):
        self.session = requests.Session()
        self.captcha_solver = CaptchaSolver()
        self.base_url = "https://northeast-courts.gov.in"  # Example URL, replace with actual URL
        self.max_captcha_attempts = 5
        
        # Set up retry mechanisms - add headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
    def search_case(self, court_name, case_type, case_number, case_year):
        """
        Search for a case in the Northeast court portal with robust error handling and retries
        
        Args:
            court_name: Name of the court
            case_type: Type of the case
            case_number: Case number
            case_year: Year of the case
            
        Returns:
            dict: Structured case details
        """
        attempt = 0
        captcha_attempts = 0
        max_attempts = 3  # Maximum number of attempts for the entire process
        
        while attempt < max_attempts:
            try:
                print(f"Search attempt {attempt + 1} for case {case_number}/{case_year}")
                attempt += 1
                
                # Step 1: Navigate to search page
                search_url = f"{self.base_url}/case-status"
                response = self.session.get(search_url, timeout=30)
                response.raise_for_status()
                
                # Step 2: Extract CAPTCHA image
                soup = BeautifulSoup(response.text, 'html.parser')
                captcha_result = self._extract_captcha(soup, search_url)
                
                if not captcha_result or not captcha_result.image:
                    print("Failed to extract CAPTCHA image, retrying...")
                    time.sleep(2)  # Add delay before retry
                    continue
                
                # Try solving the CAPTCHA with multiple attempts if needed
                captcha_text = ""
                captcha_attempts = 0
                
                while not captcha_text and captcha_attempts < self.max_captcha_attempts:
                    # Step 3: Solve CAPTCHA
                    captcha_text = self.captcha_solver.solve_captcha(captcha_result.image)
                    
                    if not captcha_text:
                        print(f"Failed to solve CAPTCHA, attempt {captcha_attempts + 1}/{self.max_captcha_attempts}")
                        captcha_attempts += 1
                        
                        # If we have more attempts left, try to get a new CAPTCHA
                        if captcha_attempts < self.max_captcha_attempts:
                            # Refresh the page to get a new CAPTCHA
                            response = self.session.get(search_url, timeout=30)
                            soup = BeautifulSoup(response.text, 'html.parser')
                            captcha_result = self._extract_captcha(soup, search_url)
                            
                            if not captcha_result or not captcha_result.image:
                                print("Failed to extract new CAPTCHA image")  
                                break
                                
                            # Add delay to avoid rate limiting
                            time.sleep(1)
                
                if not captcha_text:
                    print("Failed to solve CAPTCHA after multiple attempts")  
                    # Try again from the beginning
                    continue
                
                print(f"Solved CAPTCHA: {captcha_text}")
                
                # Step 4: Submit search form with CAPTCHA
                form_data = self._prepare_form_data(soup, {
                    'court_name': court_name,
                    'case_type': case_type,
                    'case_number': case_number,
                    'case_year': case_year,
                    'captcha': captcha_text
                })
                
                print(f"Submitting search form with data: {form_data}")
                
                # Get the actual form action URL
                form = soup.find('form', {'id': 'caseSearchForm'}) or soup.find('form')
                form_action = form.get('action') if form else search_url
                form_method = form.get('method', 'post').lower() if form else 'post'
                
                # Absolute URL for form submission
                if form_action and not form_action.startswith('http'):
                    form_action = f"{self.base_url.rstrip('/')}/{form_action.lstrip('/')}"
                else:
                    form_action = search_url
                
                # Submit the form using the correct method
                if form_method == 'post':
                    search_response = self.session.post(form_action, data=form_data, timeout=30)
                else:
                    search_response = self.session.get(form_action, params=form_data, timeout=30)
                
                search_response.raise_for_status()
                
                # Step 5: Parse the search results
                results_soup = BeautifulSoup(search_response.text, 'html.parser')
                
                # Check if CAPTCHA failed or form submission failed
                if 'Invalid CAPTCHA' in search_response.text or 'captcha' in search_response.text.lower() and 'incorrect' in search_response.text.lower():
                    print("Invalid CAPTCHA detected in response")
                    captcha_attempts += 1
                    if captcha_attempts < self.max_captcha_attempts:
                        # Try again with a new CAPTCHA
                        continue
                    else:
                        raise Exception("Failed to solve CAPTCHA after maximum attempts")
                
                # Check if no results found
                if 'No records found' in search_response.text or 'no case found' in search_response.text.lower():
                    print("No case records found for the search criteria")
                    return {
                        'caseInfo': self._empty_case_info(court_name, case_type, case_number, case_year),
                        'hearings': [],
                        'orders': [],
                        'judgments': [],
                        'nextHearingDate': None
                    }
                
                # Step 6: Extract case details
                case_info = self._extract_case_info(results_soup, court_name, case_type, case_number, case_year)
                hearings = self._extract_hearings(results_soup)
                orders = self._extract_orders(results_soup)
                judgments = self._extract_judgments(results_soup)
                next_hearing_date = self._extract_next_hearing_date(results_soup)
                
                # Return structured data
                return {
                    'caseInfo': case_info,
                    'hearings': hearings,
                    'orders': orders,
                    'judgments': judgments,
                    'nextHearingDate': next_hearing_date
                }
                
            except requests.exceptions.RequestException as e:
                print(f"Network error during court portal scraping: {str(e)}")
                # Add exponential backoff
                backoff_time = 2 ** attempt
                print(f"Backing off for {backoff_time} seconds before retry")
                time.sleep(backoff_time)
            except Exception as e:
                print(f"Error in court portal scraper: {str(e)}")
                if attempt < max_attempts - 1:
                    # Add delay before retry
                    time.sleep(2)
                else:
                    # If all attempts failed, raise the exception
                    raise Exception(f"Failed to scrape court portal after {max_attempts} attempts: {str(e)}") from e
                    
        # If we get here, we've exhausted all attempts
        raise Exception(f"Failed to scrape court portal after {max_attempts} attempts")
    
    def _extract_captcha(self, soup, page_url):
        """Extract CAPTCHA image from the page"""
        try:
            # Try different strategies to find the CAPTCHA image
            captcha_img = soup.find('img', {'id': 'captcha'}) or \
                         soup.find('img', {'name': 'captcha'}) or \
                         soup.find('img', {'class': 'captcha'}) or \
                         soup.find('img', {'src': lambda src: 'captcha' in str(src).lower()}) or \
                         soup.find('img', {'alt': lambda alt: 'captcha' in str(alt).lower()})
            
            if not captcha_img:
                # Try more generic approach - look for image near input with captcha-related attributes
                captcha_input = soup.find('input', {'name': lambda name: 'captcha' in str(name).lower()}) or \
                               soup.find('input', {'id': lambda id: 'captcha' in str(id).lower()})
                
                if captcha_input:
                    # Look for an image nearby (either a sibling or within the same parent)
                    parent = captcha_input.parent
                    captcha_img = parent.find('img')
            
            if not captcha_img:
                print("Could not find captcha image on the page")
                return None
                
            captcha_img_url = captcha_img.get('src')
            
            # Make sure we have an absolute URL
            if not captcha_img_url.startswith('http'):
                if captcha_img_url.startswith('/'):
                    captcha_img_url = f"{self.base_url.rstrip('/')}{captcha_img_url}"
                else:
                    captcha_img_url = f"{self.base_url.rstrip('/')}/{captcha_img_url}"
            
            # Get the captcha image
            print(f"Fetching CAPTCHA image from: {captcha_img_url}")
            captcha_img_response = self.session.get(captcha_img_url, timeout=30)
            captcha_img_response.raise_for_status()
            
            # Create a PIL image from the response content
            captcha_image = Image.open(io.BytesIO(captcha_img_response.content))
            
            # Get page title if available
            page_title = soup.find('title').text.strip() if soup.find('title') else ""
            
            # Return the extraction result
            return CaptchaExtractionResult(
                image=captcha_image,
                url=captcha_img_url,
                page_title=page_title,
                page_url=page_url
            )
            
        except Exception as e:
            print(f"Error extracting CAPTCHA: {str(e)}")
            return None
    
    def _prepare_form_data(self, soup, base_data):
        """Prepare form data for submission, including hidden fields"""
        try:
            form_data = base_data.copy()
            
            # Find the form containing captcha
            form = soup.find('form', {'id': 'caseSearchForm'}) or \
                  soup.find('form', {'name': lambda name: 'case' in str(name).lower() if name else False}) or \
                  soup.find('form', {'action': lambda action: 'search' in str(action).lower() if action else False}) or \
                  soup.find('form')  # Fallback to first form if none of the above match
            
            if form:
                # Extract all hidden input fields
                hidden_inputs = form.find_all('input', {'type': 'hidden'})
                for input_field in hidden_inputs:
                    name = input_field.get('name')
                    value = input_field.get('value', '')
                    if name and name not in form_data:
                        form_data[name] = value
                        
                # Make sure we're using the correct field names for our data
                # Look for the actual input field names used in the form
                input_fields = form.find_all('input') + form.find_all('select')
                
                field_name_map = {
                    'court_name': ['court', 'courtname', 'court_name', 'courtName'],
                    'case_type': ['case_type', 'casetype', 'caseType', 'type'],
                    'case_number': ['case_number', 'casenumber', 'caseNumber', 'number', 'case_no', 'caseno'],
                    'case_year': ['case_year', 'caseyear', 'caseYear', 'year'],
                    'captcha': ['captcha', 'captchaText', 'captcha_text', 'security_code']
                }
                
                # Map our field names to the actual field names in the form
                actual_field_names = {}
                for field in input_fields:
                    field_name = field.get('name', '')
                    if not field_name:
                        continue
                        
                    for our_field, possible_names in field_name_map.items():
                        if field_name.lower() in [name.lower() for name in possible_names]:
                            actual_field_names[our_field] = field_name
                
                # Update form_data with the actual field names
                updated_form_data = {}
                for our_field, value in form_data.items():
                    if our_field in actual_field_names:
                        updated_form_data[actual_field_names[our_field]] = value
                    else:
                        updated_form_data[our_field] = value
                        
                return updated_form_data
            
            # If no form found, return the original data
            return form_data
                
        except Exception as e:
            print(f"Error preparing form data: {str(e)}")
            return base_data
    
    def _empty_case_info(self, court_name, case_type, case_number, case_year):
        """Create an empty case info object with search criteria"""
        return {
            'caseNumber': case_number,
            'caseYear': case_year,
            'courtName': court_name,
            'caseType': case_type,
            'filingDate': "",
            'status': "Not Found",
            'plaintiff': "",
            'defendant': "",
            'judge': ""
        }
    
    def _extract_case_info(self, soup, court_name=None, case_type=None, case_number=None, case_year=None):
        """Extract basic case information from the soup with improved robustness"""
        try:
            info = {}
            
            # Try multiple strategies to find case information
            # Strategy 1: Look for a table with case details
            info_tables = soup.find_all('table', {'class': lambda c: c and any(x in str(c).lower() for x in ['case', 'detail', 'info'])})
            if not info_tables:
                # Try without class restriction
                info_tables = soup.find_all('table')
            
            for table in info_tables:
                # Extract information from table rows
                rows = table.find_all('tr')
                for row in rows:
                    # Get cells (might be th or td)
                    cells = row.find_all(['th', 'td'])
                    if len(cells) >= 2:
                        # Extract key and value
                        key_cell = cells[0]
                        value_cell = cells[1]
                        
                        # Clean the key and value text
                        key = key_cell.get_text().strip(':').strip().lower().replace(' ', '_')
                        value = value_cell.get_text().strip()
                        
                        # Skip empty values
                        if not value:
                            continue
                            
                        info[key] = value
            
            # Strategy 2: Look for labeled elements
            labels = soup.find_all(['label', 'div', 'span'], {'class': lambda c: c and any(x in str(c).lower() for x in ['label', 'field-label'])})
            for label in labels:
                key = label.get_text().strip(':').strip().lower().replace(' ', '_')
                # Try to find the associated value in a sibling or neighbor element
                value_elem = label.find_next_sibling(['div', 'span', 'p'])
                if value_elem:
                    value = value_elem.get_text().strip()
                    if value:
                        info[key] = value
            
            # Strategy 3: Look for definition lists
            dl_elements = soup.find_all('dl')
            for dl in dl_elements:
                dt_elements = dl.find_all('dt')
                for dt in dt_elements:
                    key = dt.get_text().strip(':').strip().lower().replace(' ', '_')
                    dd = dt.find_next_sibling('dd')
                    if dd:
                        value = dd.get_text().strip()
                        if value:
                            info[key] = value
            
            # Map to our model structure with intelligent field mapping
            field_mappings = {
                'caseNumber': ['case_no', 'case_number', 'casenumber', 'case_id', 'caseid', 'number'],
                'caseYear': ['year', 'case_year', 'filing_year'],
                'courtName': ['court', 'court_name', 'courtname'],
                'caseType': ['case_type', 'casetype', 'type'],
                'filingDate': ['filing_date', 'date_of_filing', 'registration_date', 'dated', 'date'],
                'status': ['status', 'case_status'],
                'plaintiff': ['petitioner', 'plaintiff', 'applicant', 'complainant'],
                'defendant': ['respondent', 'defendant', 'accused', 'opposite_party'],
                'judge': ['judge', 'presiding_officer', 'bench']
            }
            
            result = {}
            for field, possible_keys in field_mappings.items():
                # Try to find a matching key in the extracted info
                value = None
                for key in possible_keys:
                    if key in info and info[key]:
                        value = info[key]
                        break
                        
                # Use the value if found, otherwise use defaults or search parameters
                if value:
                    result[field] = value
                elif field == 'caseNumber' and case_number:
                    result[field] = case_number
                elif field == 'caseYear' and case_year:
                    result[field] = case_year
                elif field == 'courtName' and court_name:
                    result[field] = court_name
                elif field == 'caseType' and case_type:
                    result[field] = case_type
                else:
                    result[field] = ""
            
            return result
                
        except Exception as e:
            print(f"Error extracting case info: {str(e)}")
            # Return default info using search parameters
            return self._empty_case_info(court_name, case_type, case_number, case_year)
    
    def _extract_case_info(self, soup):
        """Extract basic case information from the soup"""
        # This is a placeholder. Actual implementation would depend on the structure of the portal
        try:
            info = {}
            # Example extraction logic
            info_table = soup.find('table', {'class': 'case-details'})
            if info_table:
                rows = info_table.find_all('tr')
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 2:
                        key = cols[0].text.strip(':').strip().lower().replace(' ', '_')
                        value = cols[1].text.strip()
                        info[key] = value
            
            # Map to our model structure
            return {
                'caseNumber': info.get('case_no', ''),
                'caseYear': info.get('year', ''),
                'courtName': info.get('court', ''),
                'caseType': info.get('case_type', ''),
                'filingDate': info.get('filing_date', ''),
                'status': info.get('status', ''),
                'plaintiff': info.get('petitioner', ''),
                'defendant': info.get('respondent', ''),
                'judge': info.get('judge', '')
            }
        except Exception as e:
            print(f"Error extracting case info: {str(e)}")
            return {}
    
    def _extract_hearings(self, soup):
        """Extract hearing information from the soup"""
        # This is a placeholder. Actual implementation would depend on the structure of the portal
        hearings = []
        try:
            hearings_table = soup.find('table', {'class': 'hearings'})
            if hearings_table:
                rows = hearings_table.find_all('tr')[1:]  # Skip header row
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 5:
                        hearing = {
                            'date': cols[0].text.strip(),
                            'time': cols[1].text.strip(),
                            'purpose': cols[2].text.strip(),
                            'courtroom': cols[3].text.strip(),
                            'status': cols[4].text.strip()
                        }
                        hearings.append(hearing)
        except Exception as e:
            print(f"Error extracting hearings: {str(e)}")
        return hearings
    
    def _extract_orders(self, soup):
        """Extract order information from the soup"""
        # This is a placeholder. Actual implementation would depend on the structure of the portal
        orders = []
        try:
            orders_table = soup.find('table', {'class': 'orders'})
            if orders_table:
                rows = orders_table.find_all('tr')[1:]  # Skip header row
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 4:
                        order = {
                            'date': cols[0].text.strip(),
                            'type': cols[1].text.strip(),
                            'description': cols[2].text.strip(),
                            'issuedBy': cols[3].text.strip()
                        }
                        orders.append(order)
        except Exception as e:
            print(f"Error extracting orders: {str(e)}")
        return orders
    
    def _extract_judgments(self, soup):
        """Extract judgment information from the soup"""
        # This is a placeholder. Actual implementation would depend on the structure of the portal
        judgments = []
        try:
            judgments_table = soup.find('table', {'class': 'judgments'})
            if judgments_table:
                rows = judgments_table.find_all('tr')[1:]  # Skip header row
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 4:
                        judgment = {
                            'date': cols[0].text.strip(),
                            'type': cols[1].text.strip(),
                            'summary': cols[2].text.strip(),
                            'issuedBy': cols[3].text.strip()
                        }
                        judgments.append(judgment)
        except Exception as e:
            print(f"Error extracting judgments: {str(e)}")
        return judgments
    
    def _extract_next_hearing_date(self, soup):
        """Extract next hearing date from the soup"""
        # This is a placeholder. Actual implementation would depend on the structure of the portal
        try:
            next_hearing_element = soup.find('div', {'class': 'next-hearing'})
            if next_hearing_element:
                return next_hearing_element.text.strip()
            else:
                # Try to find from hearings table
                hearings_table = soup.find('table', {'class': 'hearings'})
                if hearings_table:
                    rows = hearings_table.find_all('tr')[1:]  # Skip header row
                    for row in rows:
                        cols = row.find_all('td')
                        if len(cols) >= 5 and 'scheduled' in cols[4].text.lower():
                            return cols[0].text.strip()
            return None
        except Exception as e:
            print(f"Error extracting next hearing date: {str(e)}")
            return None
