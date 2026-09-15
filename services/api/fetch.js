import axios from "axios";
import endpoints from "./endpoints";

export async function userLogin(data) {
  try {
    const response = await axios.post(endpoints.login, data);
    return response;
  } catch (error) {
    return returnErrorMsg(error);
  }
}

export async function userLogOut(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);
  try {
    let user = null;

    const response = await axios.post(
      endpoints.logout,
      {},
      {
        headers: { Authorization: AuthStr },
      }
    );
    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function userDetails(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(endpoints.user, {
      headers: { Authorization: AuthStr },
    });

    return response;
  } catch (error) {
    return returnErrorMsg(error);
  }
}

export async function verifyOTP(data) {
  try {
    const response = await axios.post(endpoints.verifyOTP, data);
    // console.log("RESPONSEEE  ::", response);
    return response;
  } catch (error) {
    console.log("Verify OTP API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function resendOTP(data) {
  try {
    const response = await axios.post(endpoints.resendOTP, data);
    console.log("RESPONSEEE  ::", response);
    return response;
  } catch (error) {
    console.log("Verify OTP API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function forgotPassword(data) {
  try {
    const response = await axios.post(endpoints.forgot, data);
    // console.log("RESPONSEE ::", response);
    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function resetPassword(data) {
  try {
    const response = await axios.post(endpoints.reset, data);
    console.log("RESPONSEE ::", response);
    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchDashBoardData(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(endpoints?.getDashboardData, {
      headers: { Authorization: AuthStr },
    });
    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

// Projects for the signed-in user. Distinct from fetchPackages below:
// this returns `data.projects` (each carrying project_id), which the
// project image gallery dropdown needs.
export async function fetchProjects(authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(endpoints.projects, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch Projects API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchPackages(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(endpoints.packages, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchProjectsDetailsByPId(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.projectsDetails, data, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchProjectsMilestonesByPId(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.projectMilestones, data, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchPhysicalProgressByMId(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      endpoints.physicalProgressMilestone,
      data,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function updatePhysicalProgress(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      endpoints.updatePhysicalProgressMilestone,
      data,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function uploadMilestoneImage(data, config) {
  try {
    // const response = await axios.post(endpoints.uploadMilestoneImage, data, {
    //   headers: {
    //     Authorization: AuthStr,
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    const response = await axios.post(
      endpoints.uploadMilestoneImage,
      data,
      config
    );

    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Upload canceled:", error?.message);
      return returnErrorMsg(error);
    } else if (error.response) {
      console.log("Server responded with an error:", error.response.data);
      return returnErrorMsg(error);
    } else if (error.request) {
      console.log("Network error occurred:", error.request);
      return returnErrorMsg(error);
    } else {
      console.log("Error setting up the request:", error.message);
      return returnErrorMsg(error);
    }
  }
}

export async function fetchMilestoneImage(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.milestoneImages, data, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchMilestoneImagesByPID(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.milestoneImagesByPID, data, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchProjectPhasesByPID(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.fetchProjectPhasesByPID, data, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchPhasesActivitiesByPID(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      endpoints.fetchPhasesActivitesByPID,
      data,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchPhasesSubActivitiesByPID(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      endpoints.fetchPhasesSubActivitesByPID,
      data,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function uploadActivitiesImage(data, config) {
  try {
    // const response = await axios.post(endpoints.uploadMilestoneImage, data, {
    //   headers: {
    //     Authorization: AuthStr,
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    const response = await axios.post(
      endpoints.uploadPhaseActivitiesImage,
      data,
      config
    );

    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Upload canceled:", error?.message);
      return returnErrorMsg(error);
    } else if (error.response) {
      console.log("Server responded with an error:", error.response.data);
      return returnErrorMsg(error);
    } else if (error.request) {
      console.log("Network error occurred:", error.request);
      return returnErrorMsg(error);
    } else {
      console.log("Error setting up the request:", error.message);
      return returnErrorMsg(error);
    }
  }
}

export async function fetchActivitiesImages(data, authToken) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      endpoints.fetchPhaseActivitiesImages,
      data,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchLocationData(data) {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${data?.latitude}&lon=${data?.longitude}&apiKey=0dfff6decc0b46cb9720a376b936c8ef`
    );

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

/// New ------------------------------------------------------------------>>>>>>>>>>>>>>>>>>>>>>

export async function fetchSubProjects(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(endpoints.subProjects, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchSafeGuardEntries(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(
      `${endpoints.getSafeguardEntries}/${payload}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function saveSafeGuardEntries(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.post(
      `${endpoints.saveSafeguardEntries}`,
      payload,
      {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function saveSafeGuardEntriesImage(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.post(
      `${endpoints.saveSafeguardEntriesImage}`,
      payload,
      {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchECPPhycialProgress(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(
      `${endpoints.getECPPhysicalProgress}${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error?.message);
    return returnErrorMsg(error);
  }
}

export async function fetchECPActivityStages(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(`${endpoints.getECPActivityStages}${Id}`, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error?.message);
    return returnErrorMsg(error);
  }
}

export async function saveECPPhycialProgressImage(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      `${endpoints.saveECPPhysicalProgressImage}`,
      payload,
      {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

// Fixing Remaining Id
export async function fetchOldSubpackageBoqEntries(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(
      `${endpoints.getOldWiseBOQProgress}${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error?.message);
    return returnErrorMsg(error);
  }
}

export async function fetchBoqEntriesDetails(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(
      `${endpoints.getBOQProgressDetails}${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error?.message);
    return returnErrorMsg(error);
  }
}

export async function saveBOQProgress(authToken, payload, onUploadProgress) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(`${endpoints.saveBOQProgress}`, payload, {
      headers: {
        Authorization: AuthStr,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response?.data;
  } catch (error) {
    console.log("Fetch Save BOQ API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchFinancalProgress(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.get(`${endpoints.getFinancialProgress}${Id}`, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error?.message);
    return returnErrorMsg(error);
  }
}

export async function saveFinancialProgress(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(
      `${endpoints.saveFinancialProgress}`,
      payload,
      {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

// <<<<<------------------ Work Progresss -------------------->>>>>>>>>>>>>
export async function uploadWorkProgressImages(
  authToken,
  payload,
  onUploadProgress
) {
  const AuthStr = "Bearer ".concat(authToken);

  // `payload` is FormData: project_id, work_component_id, description,
  // lat, long and images[]. The Accept header is required - without it
  // Laravel answers validation errors with a 302 HTML redirect, not 422 JSON.
  try {
    const response = await axios.post(
      endpoints.uploadWorkProgressImages,
      payload,
      {
        headers: {
          Authorization: AuthStr,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );

    return response?.data;
  } catch (error) {
    // 422 carries field errors; 401 carries only `message`.
    const validation = error?.response?.data?.errors;

    if (validation) {
      const firstField = Object.keys(validation)[0];
      return {
        success: false,
        message: validation[firstField]?.[0] || error?.response?.data?.message,
      };
    }

    if (error?.response?.data?.message) {
      return { success: false, message: error.response.data.message };
    }

    console.log("Upload Work Progress Images API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function saveWorkProgress(authToken, payload) {
  const AuthStr = "Bearer ".concat(authToken);

  try {
    const response = await axios.post(endpoints.saveWorkProgress, payload, {
      headers: {
        Authorization: AuthStr,
        Accept: "application/json",
      },
    });

    return response?.data;
  } catch (error) {
    console.log("Save Work Progress API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchWorkProgress(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(endpoints?.getAllWorkProgress, {
      headers: {
        Authorization: AuthStr,
      },
    });

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchWorkProgressById(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(
      `${endpoints?.getAllWorkProgressById}/${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function fetchAllWorkProgressSubPackageProjectById(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.get(
      `${endpoints?.getAllWorkProgressSubPackageProjectById}${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch User API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

export async function deleteWorkProgressById(authToken, Id) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    const response = await axios.delete(
      `${endpoints?.deleteWorkProgressById}/${Id}`,
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Fetch API Error: ", error.message);
    return returnErrorMsg(error);
  }
}

function returnErrorMsg(error) {
  // Extracting different parts of the error
  let msg = error?.response?.data?.msg || error.message;
  let status = error?.response?.status || "No Status";

  // Log only non-sensitive fields. The full axios error carries
  // config.headers.Authorization, so it must never be logged.
  console.log("API Error:", status, msg);

  // Returning a structured error message
  return { data: { status: false, msg: msg } };
}
