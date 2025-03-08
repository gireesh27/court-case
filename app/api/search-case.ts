import express, { Router, Request, Response } from 'express';
import { CaseSearchRequest } from '@/types/types';
import { searchCaseInDatabase } from '@/components/searchCaseInDatabase';

const router: Router = express.Router();

router.post('/db-search/search_case', async (req: Request<{}, {}, CaseSearchRequest>, res: Response) => {
    try {
        const caseDetails = await searchCaseInDatabase(req.body);
        res.json(caseDetails);
    } catch (error) {
        console.error('Error in search_case:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;