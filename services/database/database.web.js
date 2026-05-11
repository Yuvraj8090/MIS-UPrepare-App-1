const emptyList = [];

const createNoopResult = () => ({
  changes: 0,
  insertId: null,
  lastInsertRowId: null,
});

const noopAsync = async () => createNoopResult();
const noopListAsync = async () => emptyList;
const noopValueAsync = async () => null;
const noopVoid = async () => {};
const noopCallback = () => {};

export const initDB = noopVoid;
export const saveUserData = noopAsync;
export const saveAccessToken = noopAsync;
export const fetchUserData = noopListAsync;
export const fetchAccessToken = noopValueAsync;
export const clearUserData = noopCallback;
export const clearToken = noopCallback;
export const saveDashboardData = noopAsync;
export const fetchUserDashBoardData = noopListAsync;
export const saveSqlProjectData = noopAsync;
export const fetchUserProjectData = noopListAsync;
export const saveSqlProjectDetails = noopAsync;
export const fetchProjectDetailsData = noopListAsync;
export const saveSqlProjectMilestone = noopAsync;
export const fetchProjectMilestonesData = noopListAsync;
export const saveSqlMilestonePhysicalProgress = noopAsync;
export const fetchMilestonePhysicalProgressData = noopListAsync;
export const saveSqlProjectActivities = noopAsync;
export const fetchProjectPhasesData = noopListAsync;
export const saveSqlPhaseActivities = noopAsync;
export const fetchPhasesActivitiesData = noopListAsync;
export const saveSqlPhaseSubActivities = noopAsync;
export const fetchPhasesSubActivitiesData = noopListAsync;
export const saveSqlPhaseActivitiesImage = noopAsync;
export const fetchPhasesActivitiesImages = noopListAsync;
export const saveSqlMilestonePhyicalImage = noopAsync;
export const fetchMilestonePhyicalImages = noopListAsync;
export const clearPhaseActivitiesImages = noopVoid;
export const clearMilestonesImages = noopVoid;
export const fetchImages = () => emptyList;
export const clearDB = noopVoid;
