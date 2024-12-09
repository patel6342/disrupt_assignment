import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = (defaultTitle) => {
  const location = useLocation();

  useEffect(() => {
    const pageTitleMap = {
      "/challenges": "Challenges - DISRUPT: Stimulating Innovation",
      "/profilePage": "Profile - DISRUPT: Stimulating Innovation",
      "/Admin": "Admin - DISRUPT: Stimulating Innovation",
    };

    const dynamicRouteTitles = {
      "/challenge/:challengeId/scenario/:scenarioId/showAllParticipants/participant/:participantId/judge": "Judging Page - DISRUPT: Stimulating Innovation",
      "/challenge/:challengeId/scenarios": "Scenarios - DISRUPT: Stimulating Innovation",
      "/challenge/:challengeId/scenario/:scenarioId": "Scenario Details - DISRUPT: Stimulating Innovation",
      "/challenge/:challengeId/scenario/:scenarioId/resultPage": "Result Page - DISRUPT: Stimulating Innovation",
      "/challenge/:challengeId/scenario/:scenarioId/showAllParticipants": "Show All Participants - DISRUPT: Stimulating Innovation",
    };

  
    const matchDynamicRoute = (path) => {
      for (const [pattern, title] of Object.entries(dynamicRouteTitles)) {
        const regex = new RegExp(`^${pattern.replace(/:[^\s/]+/g, '[^/]+')}$`);
        if (regex.test(path)) {
          return title;
        }
      }
      return null;
    };

  
    const currentPath = location.pathname;

    
    const staticTitle = pageTitleMap[currentPath];
    const dynamicTitle = matchDynamicRoute(currentPath);

  
    document.title = staticTitle || dynamicTitle || defaultTitle;
  }, [location.pathname, defaultTitle]);
};

export default usePageTitle;
