import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("u_prepare_app.db");

// Initialize the database and create a table for images

export const initDB = async () => {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS user (
          id BIGINT TEXT,
          profile_image TEXT,
          designation TEXT,
          name TEXT,
          phone_no INTEGER,
          username TEXT,
          email TEXT,
          status TEXT,
          role_id BIGINT,
          role_name TEXT,
          role_level TEXT,
          role_department TEXT,
          role_level_name TEXT
        );`,
    []
  );

  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS token (userid BIGINT PRIMARY KEY,access_token TEXT);",
    []
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS userdashboard (
            userid BIGINT TEXT, access_token TEXT, Ongoing TEXT, totalProjects TEXT, completed TEXT, expenses TEXT
          );`,
    []
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS userProjects (
            userid BIGINT TEXT, access_token TEXT, id BIGINT TEXT, name TEXT, project_id TEXT
          );`,
    []
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS projectDetails (
    name TEXT,
    project_id TEXT,
    block TEXT,
    budget TEXT,
    assembly TEXT,
    category TEXT,
    district TEXT,
    department TEXT,
    subcategory TEXT,
    project_type TEXT,
    constituency TEXT,
    dec_approval_date TEXT,
    hpc_approval_date TEXT
  );
  `
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS projectMilestones (
    id INTEGER,
    project_id TEXT,
    name TEXT,
    weightage TEXT,
    progress TEXT
  );
  `
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS milestone_physicalProgress (
    id INTEGER,
    name TEXT,
    record_id INTEGER,
    date TEXT,
    status INTEGER,
    amount INTEGER,
    percentage INTEGER,
    documents TEXT
  );`,
    []
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS projectPhases (project_id INTEGER, type_id INTEGER, name TEXT, start_date TEXT,  end_date TEXT,
    percentage TEXT,
    total_completed TEXT,
    total_activities TEXT
  );`
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS phaseActivities (project_id INTEGER, type_id INTEGER, name TEXT, id INTEGER,
            action TEXT,
            photos INTEGER,
            remarks TEXT,
            document TEXT,
            complied TEXT,
            actual_date TEXT,
            planned_date TEXT,
            sub_activities INTEGER
  );`
  );

  // await db.runAsync("DROP TABLE IF EXISTS phaseSubActivities");

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS phaseSubActivities (project_id INTEGER, type_id INTEGER, name TEXT, id INTEGER, activities_id INTEGER,
            action TEXT,
            photos INTEGER,
            remarks TEXT,
            document TEXT,
            complied TEXT,
            actual_date TEXT,
            planned_date TEXT,
            sub_activities INTEGER
  );`
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS phaseActivitiesImages (project_id INTEGER, activities_id INTEGER,
            images TEXT
  );`
  );
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS milestonePhyicalImages (mppr_id INTEGER,
            images TEXT
  );`
  );

  const res = await db.runAsync("DELETE FROM projectMilestones;");
  // console.log("RESSS DASBB::", res);
  const res11 = await db.runAsync("DELETE FROM milestone_physicalProgress;");
  // console.log("RESSS DASBB::", res11);
  const res111 = await db.runAsync("DELETE FROM phaseActivitiesImages;");
  // console.log("RESSS DASBB::", res111);

  const res1 = await db.runAsync("DELETE FROM milestonePhyicalImages");
  // console.log("RESSS DASBB::", res1);
  const res2 = await db.runAsync("DELETE FROM phaseSubActivities");
  // console.log("RESSS DASBB::", res2);

  // await db.runAsync("DROP TABLE IF EXISTS projectDetails");
  // await db.runAsync("DROP TABLE IF EXISTS token");
};

// Save user data
export const saveUserData = async (userData) => {
  console.log("USERR DATATAAAAA::", userData);
  const {
    id,
    profile_image,
    designation,
    name,
    phone_no,
    username,
    email,
    status,
    role: {
      id: role_id,
      name: role_name,
      level: role_level,
      department: role_department,
      level_name: role_level_name,
    },
  } = userData;

  const userExists = await db.getFirstAsync(
    "SELECT username FROM user WHERE username = ?",
    [username]
  );

  console.log("USER EXTSSS ::", userExists);

  if (userExists) {
    console.log("User Info. Already Exists ::", userExists);
  } else {
    const res = await db.runAsync(
      `INSERT INTO user (
              id, profile_image, designation, name, phone_no, username, email, status,
              role_id, role_name, role_level, role_department, role_level_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        profile_image,
        designation,
        name,
        phone_no,
        username,
        email,
        status,
        role_id,
        role_name,
        role_level,
        role_department,
        role_level_name,
      ]
    );

    console.log("RESSSSS SAVE ::", res?.changes);
  }
};

// Save the access token
export const saveAccessToken = async (data) => {
  console.log("USERR DATATAAAAA TOKENNN ::", data);

  const {
    access_token,
    user: { id: userid },
  } = data;

  const usertokenExist = await db.getFirstAsync(
    "SELECT userid FROM token WHERE userid = ?",
    [userid]
  );
  console.log("USER TOKENN EXTSSS ::", usertokenExist);

  if (usertokenExist) {
    const res = await db.runAsync(
      "UPDATE token SET access_token = ? WHERE userid = ?",
      [access_token, userid]
    );
    console.log("RESSSSS update Token ::", res?.lastInsertRowId);
  } else {
    const res = await db.runAsync(
      "INSERT OR REPLACE INTO token (userid, access_token) VALUES (?,?)",
      [userid, access_token]
    );

    console.log("RESSSSS TOKEN SAVE ::", res?.changes);
  }

  //   //   const res = await db.runAsync("DELETE FROM user");
};

// Retrieve user data
export const fetchUserData = async (callback) => {
  const data = await db.getAllAsync("SELECT * FROM user;");
  return data;
};

// Retrieve the access token
export const fetchAccessToken = async (callback) => {
  const data = await db.getFirstAsync(
    "SELECT access_token FROM token LIMIT 1;"
  );
  //   console.log("FETCHH TOKENN ::", data);
  return data;
};

// Clear user data
export const clearUserData = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM user;",
      [],
      () => console.log("User data cleared successfully"),
      (_, error) => {
        console.error("Error clearing user data:", error);
        return true;
      }
    );
  });
};

// Clear token
export const clearToken = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM token;",
      [],
      () => console.log("Token cleared successfully"),
      (_, error) => {
        console.error("Error clearing token:", error);
        return true;
      }
    );
  });
};

// Save User DashBoard data
export const saveDashboardData = async (data) => {
  //   console.log("DASBOARDD DATATAAAAA::", data);
  const {
    userId,
    access_token,
    data: {
      Ongoing: Ongoing,
      totalProjects: totalProjects,
      completed: completed,
      expenses: expenses,
    },
  } = data;

  const userExists = await db.getFirstAsync(
    `SELECT * FROM userdashboard WHERE userid = ?`,
    [userId]
  );

  //   console.log("RESSSSS USER EXITISS ::", userExists);
  const UPDATE = await db.prepareAsync(
    `UPDATE userdashboard
              SET access_token = ?, Ongoing = ?, totalProjects = ?, completed = ?, expenses = ?
              WHERE userid = ?`
  );
  const INSERT = await db.prepareAsync(
    `INSERT INTO userdashboard (
                        userid, access_token, Ongoing, totalProjects, completed, expenses
                      ) VALUES (?, ?, ?, ?, ?,?)`
  );

  try {
    if (userExists) {
      const res = await UPDATE.executeAsync([
        userId,
        access_token,
        Ongoing,
        totalProjects,
        completed,
        expenses,
      ]);
      console.log("Dashboard Data UPDATE ::", res?.changes);
    } else {
      const res = await INSERT.executeAsync([
        userId,
        access_token,
        Ongoing,
        totalProjects,
        completed,
        expenses,
      ]);
      console.log("Dashboard Data SAVE ::", res?.changes);
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    if (userExists) {
      await UPDATE.finalizeAsync();
    } else await INSERT.finalizeAsync();
  }
};

// Access User Dashboard Data
export const fetchUserDashBoardData = async (callback) => {
  const data = await db.getFirstAsync("SELECT * FROM userdashboard;");
  //   console.log("FETCHH DASBOARDDDD DATATA  ::", data);
  return data;
};

// Save Project data
export const saveSqlProjectData = async (storeSql) => {
  const { userId, access_token, data } = storeSql;

  const userExists = await db.getFirstAsync(
    `SELECT * FROM userProjects WHERE userid = ?`,
    [userId]
  );

  const UPDATE = await db.prepareAsync(
    "UPDATE userProjects SET access_token = ?, id = ?, name = ? WHERE project_id = ?"
  );

  const INSERT = await db.prepareAsync(
    `INSERT INTO userProjects (userid, access_token, id, name, project_id) VALUES (?, ?, ?, ?, ?)`
  );

  try {
    if (userExists) {
      await data.map((item) => {
        console.log("UPDATEE ITEMMM ::", item);
        const res = UPDATE.executeAsync([
          access_token,
          item.id,
          item.name,
          item.project_id,
        ]);
        console.log("PROJETCT Data UPDATE ::", res);
      });
    } else {
      await data.map((item) => {
        console.log("INTERTT ITEMMM ::", item);
        const res = INSERT.executeAsync([
          userId,
          access_token,
          item.id,
          item.name,
          item.project_id,
        ]);
        console.log("PROJECTT Data SAVE ::", res);
      });
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    // if (userExists) {
    //   await UPDATE.finalizeAsync();
    // } else await INSERT.finalizeAsync();
  }
};

// Access User Project Data
export const fetchUserProjectData = async (userId) => {
  const data = await db.getAllAsync(
    "SELECT * FROM userProjects WHERE userid = ?;",
    [userId]
  );
  // console.log("FETCHH PROJECTT DATATA  ::", data);
  return data;
};

// Save Project data
export const saveSqlProjectDetails = async (storeSql) => {
  const { data, project_id } = storeSql;

  const projectExists = await db.getFirstAsync(
    `SELECT * FROM projectDetails WHERE project_id = ?`,
    [project_id]
  );

  const INSERT = await db.prepareAsync(
    "INSERT INTO projectDetails (name, project_id, block, budget, assembly, category, district, department, subcategory, project_type, constituency, dec_approval_date, hpc_approval_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  try {
    if (projectExists) {
      console.log("PROJECT Deatils Exists!!");
    } else {
      const res = await INSERT.executeAsync([
        data.name,
        project_id,
        data?.block,
        data?.budget,
        data?.assembly,
        data?.category,
        data?.district,
        data?.department,
        data?.subcategory,
        data?.project_type,
        data?.constituency,
        data?.dec_approval_date,
        data?.hpc_approval_date,
      ]);
      console.log("PROJECTT Data SAVE ::", res?.changes);
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    await INSERT.finalizeAsync();
  }
};

// Access Project Details Data
export const fetchProjectDetailsData = async (project_id) => {
  const data = await db.getAllAsync(
    "SELECT * FROM projectDetails WHERE project_id = ?;",
    [project_id]
  );
  console.log("FETCHH PROJECTT Details DATATA  ::", data);
  return data;
};

// Save Project Milestone data
export const saveSqlProjectMilestone = async (storeSql) => {
  console.log("Projectt MIleSToenee DATATAAAAA::", storeSql);
  const { data, project_id } = storeSql;

  // const res2 = await db.runAsync("DELETE FROM projectMilestones;");
  // console.log("RESSS USERR::", res2);

  const UPDATE = await db.prepareAsync(
    "UPDATE projectMilestones SET name = ?, weightage = ?, progress = ? WHERE id = ? AND project_id = ?"
  );

  const INSERT = await db.prepareAsync(
    "INSERT INTO projectMilestones (id, project_id, name, weightage, progress) VALUES (?, ?, ?, ?, ?)"
  );

  try {
    for (const item of data) {
      const existingRecord = await db.getFirstAsync(
        `SELECT * FROM projectMilestones WHERE id = ? AND project_id = ?`,
        [item?.id, project_id]
      );
      if (existingRecord) {
        const res = UPDATE.executeAsync([
          item?.name,
          item?.weightage,
          item?.progress,
          item?.id,
          project_id,
        ]);
        console.log("PROJECTT Milestone Data UPDATEE ::", res);
      } else {
        const res = INSERT.executeAsync([
          item.id,
          project_id,
          item?.name,
          item?.weightage,
          item?.progress,
        ]);
        console.log("PROJECTT Milestone Data SAVE ::", res);
      }
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    await INSERT.finalizeAsync();
  }
};

// Access Project Milestone Data
export const fetchProjectMilestonesData = async (project_id) => {
  const data = await db.getAllAsync(
    "SELECT * FROM projectMilestones WHERE project_id = ?;",
    [project_id]
  );
  // console.log("FETCHH PROJECTT Milestones DATATA  ::", data);
  return data;
};

// Save Project Milestone data
export const saveSqlMilestonePhysicalProgress = async (storeSql) => {
  console.log("Projectt MIleSToenee Physical Progress DATATAAAAA::", storeSql);
  const { id, name, records } = storeSql;

  const UPDATE = await db.prepareAsync(
    "UPDATE milestone_physicalProgress SET name = ?, date = ?, status = ?, amount = ?, percentage = ?, documents = ? WHERE record_id = ? AND id = ?"
  );

  const INSERT = await db.prepareAsync(
    "INSERT INTO milestone_physicalProgress (id, name, record_id, date, status, amount, percentage, documents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  try {
    for (const item of records) {
      const existingRecord = await db.getFirstAsync(
        "SELECT * FROM milestone_physicalProgress WHERE record_id = ?",
        [item?.id]
      );
      if (existingRecord) {
        const res = UPDATE.executeAsync([
          name,
          item?.date,
          item?.status,
          item?.amount,
          item?.percentage,
          JSON.stringify(item.documents),
          item?.id,
          id,
        ]);
        console.log("Record Update ::", res);
      } else {
        const res = INSERT.executeAsync([
          id,
          name,
          item?.id,
          item?.date,
          item?.status,
          item?.amount,
          item?.percentage,
          JSON.stringify(item.documents),
        ]);
        console.log("Record Insert ::", res);
      }
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    await INSERT.finalizeAsync();
  }
};

// Access Milestone Physical Progress Data
export const fetchMilestonePhysicalProgressData = async (milestone_id) => {
  console.log("FETCCHC MID ::", milestone_id);
  const data = await db.getAllAsync(
    "SELECT * FROM milestone_physicalProgress WHERE id = ?;",
    [milestone_id]
  );
  console.log("FETCHH Milestones Physcial Progress DATATA  ::", data);
  return data;
};

// Save Project Activities data
export const saveSqlProjectActivities = async (storeSql) => {
  const { project_id, data } = storeSql;

  const INSERT = await db.prepareAsync(
    "INSERT INTO projectPhases (project_id, type_id, name, start_date, end_date, percentage, total_completed, total_activities) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
  );

  const UPDATE = await db.prepareAsync(
    "UPDATE projectPhases SET name = ?, start_date = ?, end_date = ?, percentage = ?, total_completed = ?, total_activities = ? WHERE project_id = ? AND type_id = ?;"
  );

  try {
    for (const item of data) {
      const existingRecord = await db.getFirstAsync(
        "SELECT * FROM projectPhases WHERE type_id = ? AND project_id = ?;",
        [item?.type_id, project_id]
      );

      if (existingRecord) {
        const res = UPDATE.executeAsync([
          item?.name,
          item?.start_date,
          item?.end_date,
          item?.percentage,
          item?.total_completed,
          item?.total_activities,
          project_id,
          item?.type_id,
        ]);
        console.log("PROJECTT Data SAVE ::", res);
      } else {
        const res = INSERT.executeAsync([
          project_id,
          item?.type_id,
          item?.name,
          item?.start_date,
          item?.end_date,
          item?.percentage,
          item?.total_completed,
          item?.total_activities,
        ]);
        console.log("PROJECTT INSERT PRoJECT Phaases SAVE ::", res);
      }
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    await INSERT.finalizeAsync();
  }
};

// Access Project Phases Data
export const fetchProjectPhasesData = async (project_id) => {
  const data = await db.getAllAsync(
    "SELECT * FROM projectPhases WHERE project_id = ?;",
    [project_id]
  );
  // console.log("FETCHH Project Phasess DATATA  ::", data);
  return data;
};

// Save Phase Activities data
export const saveSqlPhaseActivities = async (storeSql) => {
  // console.log("Phase Activities DATA:", storeSql);
  const { project_id, type_id, data } = storeSql;

  // Prepare SQL statements
  const INSERT = await db.prepareAsync(
    `INSERT INTO phaseActivities (project_id, type_id, name, id, action, photos, remarks, document, complied, actual_date, planned_date, sub_activities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  );

  const UPDATE = await db.prepareAsync(
    `UPDATE phaseActivities 
     SET name = ?, action = ?, photos = ?, remarks = ?, document = ?, complied = ?, actual_date = ?, planned_date = ?, sub_activities = ? 
     WHERE project_id = ? AND type_id = ? AND id = ?;`
  );

  try {
    // Process each item sequentially
    for (const item of data) {
      try {
        // Check if the record exists
        const existingRecord = await db.getFirstAsync(
          `SELECT * FROM phaseActivities WHERE id = ? AND type_id = ? AND project_id = ?`,
          [item?.id, type_id, project_id]
        );

        if (existingRecord) {
          // Update existing record
          const updateResult = await UPDATE.executeAsync([
            item?.name,
            item?.action,
            item?.photos,
            item?.remarks,
            item?.document,
            item?.complied,
            item?.actual_date,
            item?.planned_date,
            item?.sub_activities,
            project_id,
            type_id,
            item?.id,
          ]);
          console.log("PROJECT Data UPDATED:", updateResult);
        } else {
          // Insert new record
          const insertResult = await INSERT.executeAsync([
            project_id,
            type_id,
            item?.name,
            item?.id,
            item?.action,
            item?.photos,
            item?.remarks,
            item?.document,
            item?.complied,
            item?.actual_date,
            item?.planned_date,
            item?.sub_activities,
          ]);
          console.log("PROJECT Data INSERTED:", insertResult);
        }
      } catch (itemError) {
        console.error("Error processing item:", itemError);
      }
    }
  } catch (error) {
    console.error("Error executing SQL operations:", error);
  } finally {
    // Finalize the prepared statements
    await INSERT.finalizeAsync();
    await UPDATE.finalizeAsync();
  }
};

// Access Phases Activities Data
export const fetchPhasesActivitiesData = async (IdData) => {
  const data = await db.getAllAsync(
    "SELECT * FROM phaseActivities WHERE project_id = ? AND type_id = ?;",
    [IdData?.project_id, IdData?.type_id]
  );
  // console.log("FETCHH Phasess ACTVITIESSS  DATATA  ::", data);
  return data;
};

// Save Phase Activities data
export const saveSqlPhaseSubActivities = async (storeSql) => {
  // console.log("Phase Sub-Activitiess DATATAAAAA::", storeSql);
  const { project_id, type_id, activities_id, data } = storeSql;

  const INSERT = await db.prepareAsync(
    "INSERT INTO phaseSubActivities (project_id, type_id, activities_id, name, id, action, photos, remarks, document, complied, actual_date, planned_date, sub_activities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const UPDATE = await db.prepareAsync(
    "UPDATE phaseSubActivities SET name = ?, action = ?, photos = ?, remarks = ?, document = ?, complied = ?, actual_date = ?, planned_date = ?, sub_activities = ? WHERE project_id = ? AND type_id  = ? AND id = ? AND activities_id = ?"
  );

  try {
    for (const item of data) {
      // console.log("INTERTT ITEMMM ::", item);

      const existingRecord = await db.getFirstAsync(
        "SELECT * FROM phaseSubActivities WHERE id = ? AND activities_id = ? AND project_id = ? AND type_id = ?",
        [item?.id, activities_id, project_id, type_id]
      );
      if (existingRecord) {
        // console.log("Project Phases Exists!!!");
        const res = UPDATE.executeAsync([
          item?.name,
          item?.action,
          item?.photos,
          item?.remarks,
          item?.document,
          item?.complied,
          item?.actual_date,
          item?.planned_date,
          item?.sub_activities,
          project_id,
          type_id,
          item?.id,
          activities_id,
        ]);
        console.log("PROJECTT UPDATEE SUBACTIVITIESS Data SAVE ::", res);
      } else {
        const res = INSERT.executeAsync([
          project_id,
          type_id,
          activities_id,
          item?.name,
          item?.id,
          item?.action,
          item?.photos,
          item?.remarks,
          item?.document,
          item?.complied,
          item?.actual_date,
          item?.planned_date,
          item?.sub_activities,
        ]);
        console.log("PROJECTT INSRRETT SUBACTIVITIESS Data SAVE ::", res);
      }
    }
  } catch (error) {
    console.log("Error :", error);
  } finally {
    await INSERT.finalizeAsync();
  }
};

// Access Phases Activities Data
export const fetchPhasesSubActivitiesData = async (IdData) => {
  const data = await db.getAllAsync(
    "SELECT * FROM phaseSubActivities WHERE activities_id = 6;",
    [
      // IdData?.project_id,
      // IdData?.type_id,
      IdData?.activities_id,
    ]
  );

  return data;
};

// Insert a new image URI into the database
export const saveSqlPhaseActivitiesImage = async (storeSql) => {
  console.log("Phase Activitess Image DATATAT:", storeSql);
  const { project_id, activities_id, imageUri } = storeSql;

  try {
    const res = await db.runAsync(
      `INSERT INTO phaseActivitiesImages (project_id, activities_id, images) VALUES (?, ?, ?)`,
      [project_id, activities_id, imageUri]
    );
    // const res = await INSERT.executeAsync(project_id, activities_id, imageUri);
    console.log("Phase Activitess Image Added :", res);
    return res;
  } catch (error) {
    console.log("Error :", error);
  }
  // finally {
  //   await INSERT.finalizeAsync();
  // }
};

// Access Phases Activities Images Data
export const fetchPhasesActivitiesImages = async () => {
  const data = await db.getAllAsync("SELECT * FROM phaseActivitiesImages;");
  console.log("Fetchhh Phase Activitess Image ::", data);

  return data;
};

// Insert a new image URI into the database
export const saveSqlMilestonePhyicalImage = async (storeSql) => {
  console.log("Milestoness Image DATATAT:", storeSql);
  const { mppr_id, imageUri } = storeSql;

  try {
    const res = await db.runAsync(
      `INSERT INTO milestonePhyicalImages (mppr_id,
            images) VALUES (?, ?)`,
      [mppr_id, imageUri]
    );
    // const res = await INSERT.executeAsync(project_id, activities_id, imageUri);
    console.log("Milestones Physicall Image Added :", res);
    return res;
  } catch (error) {
    console.log("Error :", error);
  }
  // finally {
  //   await INSERT.finalizeAsync();
  // }
};

// Access Phases Activities Images Data
export const fetchMilestonePhyicalImages = async () => {
  const data = await db.getAllAsync("SELECT * FROM milestonePhyicalImages;");
  console.log("Fetchhh Milestonee Phycaiall Image ::", data);

  return data;
};

// Clear Phase Activites Imagess
export const clearPhaseActivitiesImages = async () => {
  const res1 = await db.runAsync("DELETE FROM phaseActivitiesImages;");
  console.log("RESSS Clear Phase Activites Imagess::", res1);
};

// Clear Milestones Imagess
export const clearMilestonesImages = async () => {
  const res1 = await db.runAsync("DELETE FROM milestonePhyicalImages;");
  console.log("RESSS Clear milestonePhyicalImages Imagess::", res1);
};

// Fetch all image URIs from the database
export const fetchImages = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM images;",
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      },
      (_, error) => {
        console.log("Error fetching images:", error);
        return true;
      }
    );
  });
};

// Clear token
export const clearDB = async () => {
  const res1 = await db.runAsync("DELETE FROM token;");
  // console.log("RESSS TOKENN::", res1);
  const res2 = await db.runAsync("DELETE FROM user;");
  // console.log("RESSS USERR::", res2);
  const res = await db.runAsync("DELETE FROM userdashboard;");
  // console.log("RESSS DASBB::", res);
  // const res3 = await db.runAsync("DELETE FROM userProjects;");
  // console.log("RESSS DASBB::", res3);
  // await db.runAsync("DROP TABLE IF EXISTS projectDetails");
  // console.log("RESSS DROP::", res);
};
