import axios from "axios";
import endpoints, { apiURL } from "./endpoints";

export async function validateApiAvailability(authToken = null) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(authToken ? endpoints.user : apiURL, {
      method: "GET",
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : undefined,
      signal: controller.signal,
    });

    return {
      ok:
        response.ok ||
        [200, 204, 401, 403, 404, 405].includes(response.status),
      status: response.status,
      message: response.ok
        ? "API is reachable."
        : "API responded, but the endpoint returned a non-success status.",
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message:
        error?.name === "AbortError"
          ? "API health check timed out."
          : "API is unreachable.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function userLogin(data) {
  try {
    if (__DEV__) {
      console.log("Call User Login API ::", {
        usernamePresent: Boolean(data?.username),
        passwordLength: data?.password?.length ?? 0,
      });
    }
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

export async function refreshUserToken(refreshToken) {
  if (!endpoints.refresh) {
    return {
      status: 501,
      ok: false,
      data: {
        status: false,
        msg: "Refresh endpoint is not configured.",
      },
    };
  }

  try {
    const response = await axios.post(endpoints.refresh, {
      refresh_token: refreshToken,
    });
    return response;
  } catch (error) {
    return returnErrorMsg(error);
  }
}

export async function userDetails(authToken) {
  const AuthStr = "Bearer ".concat(authToken);
  // console.log("Auth ::", AuthStr);

  try {
    console.log("Call User Details API ::");
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

// export async function fetchProjects(authToken) {
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
  console.log("Auth ::", AuthStr, Id);

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
  console.log("Auth ::", AuthStr, Id);

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
  console.log("Auth ::", AuthStr, payload);

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
  console.log("Auth OLD BOQ ::", AuthStr, Id);

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
  console.log("Auth ::", AuthStr, Id);

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
  console.log("Auth ::", AuthStr, payload);

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
  console.log("Auth ::", AuthStr, Id);

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
  console.log("Auth ::", AuthStr, payload);

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
  let msg = error?.response?.data?.msg || error.message;
  let status = error?.response?.status || "No Status";

  console.log("Error :", error);
  console.log("Error Message:", msg);
  console.log("Error Status:", status);
  console.log("Error Request _Response:", error?.request?._response);
  console.log("Error Request _URL:", error?.request?._url);

  return {
    status: typeof status === "number" ? status : 500,
    ok: false,
    data: {
      status: false,
      msg,
    },
  };
}
