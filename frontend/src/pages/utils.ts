import { personalInfoAPI, experienceAPI, projectsAPI, educationAPI, skillsAPI } from "../services/api";

export const getResponseFromKey = async (key: string, data: any) => {
  try {
    let response = {};
    switch(key) {
      case 'personal-info':
        response = await personalInfoAPI.update(data);
        break;
      case 'experience':
        response = await experienceAPI.create(data);
        break;
      case 'education':
        response = await educationAPI.create(data);
        break;
      case 'skills':
        response = await skillsAPI.create(data);
        break;
      case 'projects':
        response = await projectsAPI.create(data);
        break;
      default:
    }
    return response;
  } catch (error) {
    console.error(error);
    return { error: error.message, response: {} };
  }
}
