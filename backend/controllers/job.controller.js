import Job from '../models/job.model.js';

export const postJob = async (req, res) => {
    try {
        const { title, description,requirements, location, salary, jobType,experience, position, companyId } = req.body;
        const userId = req.id; // Assuming the user ID is passed in the request

        if (!title || !description || !location || !salary || !jobType || !experience || !position) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            location,
            salary: parseInt(salary),
            jobType,
            experienceLevel: parseInt(experience),
            position,
            company: companyId,
            created_by: userId,
        });
        return res.status(201).json({
            message: 'Job created successfully',
            job,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keywords = req.query.keywords || '';
        const query = {
            $or: [
                { title: { $regex: keywords, $options: 'i' } },
                { description: { $regex: keywords, $options: 'i' } }
            ],
        };
        const jobs = await Job.find(query)
            .populate('company', 'name')
            .populate('created_by', 'name')
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: 'No jobs found',
                success: false,
            });
        }
        return res.status(200).json({
            message: 'Jobs fetched successfully',
            jobs,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate('company', 'name')
            .populate('created_by', 'name');
        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
                success: false,
            });
        }
        return res.status(200).json({
            message: 'Job fetched successfully',
            job,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }
}

// all these above jobs are for students 

// now we will create the job for the admin or company 

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate('company', 'name')
            .populate('created_by', 'name')
            .sort({ createdAt: -1 });
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: 'No jobs found',
                success: false,
            });
        }
        return res.status(200).json({
            message: 'Jobs fetched successfully',
            jobs,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }
}