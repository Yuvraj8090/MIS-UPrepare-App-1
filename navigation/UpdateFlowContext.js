import React from "react";

const UpdateFlowContext = React.createContext(null);

export const UPDATE_REFRESH_KEYS = {
  allProjects: "allProjects",
  projectInfo: "projectInfo",
  projectMilestones: "projectMilestones",
  physicalProgressMilestone: "physicalProgressMilestone",
};

export const UpdateFlowProvider = ({ children }) => {
  const [refreshMap, setRefreshMap] = React.useState({});
  const [lastUpdateSummary, setLastUpdateSummary] = React.useState(null);

  const bumpRefresh = React.useCallback((key) => {
    setRefreshMap((current) => ({
      ...current,
      [key]: (current[key] || 0) + 1,
    }));
  }, []);

  const bumpMany = React.useCallback((keys) => {
    setRefreshMap((current) => {
      const next = { ...current };
      keys.forEach((key) => {
        next[key] = (next[key] || 0) + 1;
      });
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      refreshMap,
      bumpRefresh,
      bumpMany,
      lastUpdateSummary,
      setLastUpdateSummary,
    }),
    [refreshMap, bumpRefresh, bumpMany, lastUpdateSummary]
  );

  return (
    <UpdateFlowContext.Provider value={value}>
      {children}
    </UpdateFlowContext.Provider>
  );
};

export const useUpdateFlow = () => {
  const context = React.useContext(UpdateFlowContext);

  if (!context) {
    throw new Error("useUpdateFlow must be used within UpdateFlowProvider.");
  }

  return context;
};
