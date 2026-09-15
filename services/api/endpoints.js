const baseURL = "https://www.u-prepare.com";
const apiURL = `${baseURL}/api`;

const endpoints = {
  // Auth Section API
  user: `${apiURL}/me`,
  login: `${apiURL}/login`,
  logout: `${apiURL}/logout`,
  forgot: `${apiURL}/forgot`,
  verifyOTP: `${apiURL}/verify-otp`,
  resendOTP: `${apiURL}/resend-otp`,
  reset: `${apiURL}/reset`,

  //Data Section ------>>>>>>>
  dashboardData: `${apiURL}/user/dashboard`,
  projects: `${apiURL}/user/projects`,
  projectsDetails: `${apiURL}/user/project/details`,
  projectMilestones: `${apiURL}/user/project/milestones`,
  physicalProgressMilestone: `${apiURL}/user/project/milestone/physical-progress`,

  updatePhysicalProgressMilestone: `${apiURL}/user/project/milestone/update-physical-progress`,

  // Update Images Section ------>>>>>
  uploadMilestoneImage: `${apiURL}/user/project/milestone/upload-physical-progress-image`,

  // Fetch Images Section ------>>>>>
  milestoneImages: `${apiURL}/user/project/milestone/physical-progress-images`,

  // Fetch Images By Project Id ------>>>>>
  milestoneImagesByPID: `${apiURL}/user/project/images`,

  //Environment Field & Social Field PIU Section ------------>>>>>>>
  fetchProjectPhasesByPID: `${apiURL}/user/project/phases`,
  fetchPhasesActivitesByPID: `${apiURL}/user/project/phase/activities`,
  fetchPhasesSubActivitesByPID: `${apiURL}/user/project/phase/sub-activities`,

  // Upload Phase Activities  ----->>>>>>>>>>
  uploadPhaseActivitiesImage: `${apiURL}/user/project/phase/activity/image/upload`,
  // Fetch Activities Images -------->>>
  fetchPhaseActivitiesImages: `${apiURL}/user/project/phase/activity/images`,

  // New Routes --------------->>>>>>>>>>>

  getDashboardData: `${apiURL}/dashboard`,

  packages: `${apiURL}/packages/assigned`,

  // Sub-Projects of Package
  subProjects: `${apiURL}/packages`,

  // Safeguard Entries -------->>>>>>>>>
  getSafeguardEntries: `${apiURL}/social-safeguard/entries`,

  // Save Safeguard Entries -------->>>>>>>>>
  saveSafeguardEntries: `${apiURL}/social-safeguard/entry/save`,

  // Save Safeguard Entries Image -------->>>>>>>>>
  saveSafeguardEntriesImage: `${apiURL}/social-safeguard/entry/upload`,

  // Get ECP Physiical Progress BY Sub_Project ID -------->>>>>>>>>
  getECPPhysicalProgress: `${apiURL}/epc-progress?sub_package_project_id=`,

  // Get ECP Physiical Progress BY Sub_Project ID -------->>>>>>>>>
  getECPActivityStages: `${apiURL}/epc-progress/entries?sub_package_project_id=`,

  // Save ECP Physiical Progress BY Sub_Project ID -------->>>>>>>>>
  saveECPPhysicalProgressImage: `${apiURL}/epc-progress`,

  // Get BOQ Progress BY Sub_Project ID -------->>>>>>>>>
  getOldWiseBOQProgress: `${apiURL}/boq-progress?sub_package_project_id=`,

  // Get BOQ Progress Details BY Sub_Project ID -------->>>>>>>>>
  getBOQProgressDetails: `${apiURL}/boq-progress/entries?sub_package_project_id=`,

  // Save BOQ Progress BY Sub_Project ID -------->>>>>>>>>
  saveBOQProgress: `${apiURL}/boq-progress`,

  // Get Financial Progress BY Sub_Project ID -------->>>>>>>>>
  getFinancialProgress: `${apiURL}/financial-progress-updates?sub_package_project_id=`,

  // Save Financial Progress BY Sub_Project ID -------->>>>>>>>>
  saveFinancialProgress: `${apiURL}/financial-progress-updates`,

  // Get All Work Progress -------->>>>>>>>>
  getAllWorkProgress: `${apiURL}/work-progress`,

  // Get All Work Progress Sub-Project By Id -------->>>>>>>>>
  getAllWorkProgressById: `${apiURL}/work-progress`,

  // Delete Work Progress Sub-Project By Id -------->>>>>>>>>
  deleteWorkProgressById: `${apiURL}/work-progress`,

  // Save / Update Work Progress -------->>>>>>>>>
  saveWorkProgress: `${apiURL}/work-progress`,

  // Get All Work Progress Sub-Package Project By Id -------->>>>>>>>>
  getAllWorkProgressSubPackageProjectById: `${apiURL}/work-progress/create?sub_package_project_id=`,
};

export default endpoints;
