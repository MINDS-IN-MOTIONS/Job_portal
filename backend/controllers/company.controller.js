import Company from '../models/company.model.js';

export const registerCompany = async (req, res) => {
    try {
        const { companyName} = req.body;
        if(!companyName) {
            return res.status(400).json({ error: 'Company name is required', success: false });
        }
        let company = await Company.findOne({name:companyName });
        if(company) {
            return res.status(400).json({ error: 'Company already exists', success: false });
        }
        company = await Company.create({ name: companyName, userId: req.id });
        return res.status(201).json({ 
            message: 'Company registered successfully', 
            company,
            success: true, 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; //users who are logged in 
        const companies = await Company.find({ userId});
        if (!companies || companies.length === 0) {
            return res.status(404).json({ 
                message: 'No companies found', 
                success: false 
            });
        }
        return res.status(200).json({ 
            message: 'we get company successfully', 
            companies,
            success: true, 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                message: 'Company not found', 
                success: false 
            });
        }
        return res.status(200).json({ 
            message: 'Company fetched successfully', 
            company,
            success: true, 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
        const file = req.file;
        // here we will use cloudnary for links and files

        const updateData = {name: companyName, description, website, location};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({ 
                message: 'Company not found', 
                success: false 
            });
        }
        return res.status(200).json({ 
            message: 'Company information updated successfully', 
            company,
            success: true, 
        });
        
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}