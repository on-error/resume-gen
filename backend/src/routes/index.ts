import { Router } from "express";
import prisma from "../config/database";
import { resumeGen } from "@/util/resumeGen";
// import { Experience } from "./types";

const router = Router();

router.post('/user', async (req, res) => {
  try {
    const { email, firstName, lastName,  password } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        password,
      }
    });

    const personalInfo = await prisma.personalInfo.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        email,
      }
    });

    res.status(201).json({ message: 'User created successfully', user, personalInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/personal-info', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, phone, address, city, state, zipCode, country, linkedin, github, portfolio, website, summary, objective, dateOfBirth, nationality } = req.body;

    const personalInfo = await prisma.personalInfo.update({
      where: {
        userId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        linkedin,
        github,
        portfolio,
        website,
        summary,
        objective,
        dateOfBirth,
        nationality,
      }
    });

    res.status(200).json({ message: 'Personal info updated successfully', personalInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/experience', async (req, res) => {
  try {
    const { userId, experiences } = req.body;

    const experience = await prisma.experience.createManyAndReturn({
      data: experiences.map((experience: Experience) => ({
        userId,
        ...experience,
      })),
    });

    res.status(201).json({ message: 'Experiences created successfully', experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/education', async (req, res) => {
  try {
    const { userId, education } = req.body;
    const educationData = await prisma.education.createManyAndReturn({
      data: education.map((education: Education) => ({
        userId,
        ...education,
      })),
    });

    res.status(201).json({ message: 'Education created successfully', educationData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { userId, skills } = req.body;
    const skillsData = await prisma.skill.createManyAndReturn({
      data: skills.map((skill: Skill) => ({
        userId,
        ...skill,
      })),
    });

    res.status(201).json({ message: 'Skills created successfully', skillsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { userId, projects } = req.body;
    const projectsData = await prisma.project.createManyAndReturn({
      data: projects.map((project: Project) => ({
        userId,
        ...project,
      })),
    });

    res.status(201).json({ message: 'Projects created successfully', projectsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/certifications', async (req, res) => {
  try {
    const { userId, certifications } = req.body;
    const certificationsData = await prisma.certification.createManyAndReturn({
      data: certifications.map((certification: Certification) => ({
        userId,
        ...certification,
      })),
    });

    res.status(201).json({ message: 'Certifications created successfully', certificationsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/languages', async (req, res) => {
  try {
    const { userId, languages } = req.body;
    const languagesData = await prisma.language.createManyAndReturn({
      data: languages.map((language: Language) => ({
        userId,
        ...language,
      })),
    });

    res.status(201).json({ message: 'Languages created successfully', languagesData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/resume-templates', async (req, res) => {
  try {
    const { name, description, content, imageUrl } = req.body;
    const resumeTemplate = await prisma.resumeTemplate.create({
      data: {
        name,
        description,
        content,
        imageUrl,
      },
    });

    res.status(201).json({ message: 'Resume template created successfully', resumeTemplate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/generate-resume', async (req, res) => {
  try {
    const { userId, jobDescription } = req.body;
    const resume = await resumeGen(userId, jobDescription);
    res.status(200).json({ message: 'Resume generated successfully', resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;