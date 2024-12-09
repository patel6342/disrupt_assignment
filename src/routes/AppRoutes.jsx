import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/ui/Layout";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import Forbidden from "../pages/Forbidden";
import InternalServerError from "../pages/InternalServerError";
import UnprocessableEntity from "../pages/unprocessableEntity";
import PrivateRoute from "./PrivateRoutes";
import { useAuth } from "./AuthContext";
import usePageTitle from "./usePageTitle";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const JudgingPage = lazy(() => import("../pages/JudgingPage"));
const ScenerioPage = lazy(() => import("../pages/ScenerioPage"));
const ChallengeDetailPage = lazy(() => import("../pages/ChallengeDetailPage"));
const ResultPage = lazy(() => import("../pages/ResultPage"));
const ShowAllParticipants = lazy(() => import("../pages/ShowAlllParticpants"));

const getPrivateRouteElement = ({ role, Component, roles }) => {
  if (!role) {
    return <ComponentLoader />;
  }
  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Component />;
};

const AppRoutes = () => {
  usePageTitle("DISRUPT: Stimulating Innovation");
  const { isLoggedIn, role, checkAuthToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { statusCode } = useSelector((state) => state.errorSlice);

  useEffect(() => {
    const checkUser = async () => {
      await checkAuthToken();
      setLoading(false);
    };
    checkUser();
    console.log("role", role);
  }, [checkAuthToken]);

  if (loading) {
    return <ComponentLoader />;
  }

  if (!isLoggedIn) {
    return (
      <Layout showNavbar={false}>
        <Suspense fallback={<ComponentLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            {statusCode ? (
              <>
                {statusCode === 404 && (
                  <Route path="*" element={<NotFound />} />
                )}
                {statusCode === 401 && (
                  <Route path="*" element={<Unauthorized />} />
                )}
                {statusCode === 403 && (
                  <Route path="*" element={<Forbidden />} />
                )}
                {statusCode === 500 && (
                  <Route path="*" element={<InternalServerError />} />
                )}
                {statusCode === 422 && (
                  <Route path="*" element={<UnprocessableEntity />} />
                )}
              </>
            ) : (
              <Route path="*" element={<LoginPage />} />
            )}
          </Routes>
        </Suspense>
      </Layout>
    );
  } else {
    return (
      <Layout showNavbar={true}>
        <Suspense fallback={<ComponentLoader />}>
          <Routes>
            {role ? (
              <Route
                path="/"
                element={
                  <Navigate to={role === "admin" ? "/admin" : "/challenges"} />
                }
              />
            ) : (
              <Route path="/" element={<ComponentLoader />} />
            )}

            {statusCode ? (
              <>
                {statusCode === 404 && (
                  <Route
                    path="*"
                    element={
                      role ? (
                        <Navigate
                          to={role === "admin" ? "/admin" : "/challenges"}
                        />
                      ) : (
                        <ComponentLoader /> // Or null, depending on how you handle the loading state
                      )
                    }
                  />
                )}
                {statusCode === 401 && (
                  <Route path="*" element={<Unauthorized />} />
                )}
                {statusCode === 403 && (
                  <Route path="*" element={<Forbidden />} />
                )}
                {statusCode === 500 && (
                  <Route path="*" element={<InternalServerError />} />
                )}
                {statusCode === 422 && (
                  <Route path="*" element={<UnprocessableEntity />} />
                )}
              </>
            ) : (
              <>
                <Route
                  path="/challenges"
                  element={getPrivateRouteElement({
                    role,
                    Component: DashboardPage,
                    roles: ["game_master", "judge", "participant", "admin"],
                  })}
                />
                <Route
                  path="/profilePage"
                  element={getPrivateRouteElement({
                    role,
                    Component: ProfilePage,
                    roles: ["game_master", "judge", "participant", "admin"],
                  })}
                />
                <Route
                  path="/admin"
                  element={getPrivateRouteElement({
                    role,
                    Component: AdminPage,
                    roles: ["admin"],
                  })}
                />
                <Route
                  path="/challenge/:challengeId/scenario/:scenarioId/showAllParticipants/participant/:participantId/judge"
                  element={getPrivateRouteElement({
                    role,
                    Component: JudgingPage,
                    roles: ["judge"],
                  })}
                />
                <Route
                  path="/challenge/:challengeId/scenarios"
                  element={getPrivateRouteElement({
                    role,
                    Component: ScenerioPage,
                    roles: ["game_master", "judge", "participant", "admin"],
                  })}
                />
                <Route
                  path="/challenge/:challengeId/scenario/:scenarioId"
                  element={getPrivateRouteElement({
                    role,
                    Component: ChallengeDetailPage,
                    roles: ["game_master", "judge", "participant", "admin"],
                  })}
                />
                <Route
                  path="/challenge/:challengeId/scenario/:scenarioId/resultPage"
                  element={getPrivateRouteElement({
                    role,
                    Component: ResultPage,
                    roles: ["game_master"],
                  })}
                />
                <Route
                  path="/challenge/:challengeId/scenario/:scenarioId/showAllParticipants"
                  element={getPrivateRouteElement({
                    role,
                    Component: ShowAllParticipants,
                    roles: ["judge"],
                  })}
                />
                {role !== "admin" && (
                  <Route path="*" element={<Navigate to="/challenges" />} />
                )}
                {role === "admin" && (
                  <Route path="*" element={<Navigate to="/admin" />} />
                )}
              </>
            )}
          </Routes>
        </Suspense>
      </Layout>
    );
  }
};

export default AppRoutes;
