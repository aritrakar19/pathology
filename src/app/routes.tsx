import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { BookTestPage } from "./pages/BookTestPage";
import { TrackReportPage } from "./pages/TrackReportPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageDoctors } from "./pages/admin/ManageDoctors";
import { ManagePatients } from "./pages/admin/ManagePatients";
import { TestCategories } from "./pages/admin/TestCategories";
import { ReportsManagement } from "./pages/admin/ReportsManagement";
import { Appointments } from "./pages/admin/Appointments";
import { Payments } from "./pages/admin/Payments";
import { Analytics } from "./pages/admin/Analytics";
import { SampleCollectionQueue } from "./pages/admin/SampleCollectionQueue";
import { SampleCollectionScreen } from "./pages/admin/SampleCollectionScreen";
import { SampleTrackingScreen } from "./pages/admin/SampleTrackingScreen";
import { ResultEntryScreen } from "./pages/admin/ResultEntryScreen";
import { DoctorVerificationScreen } from "./pages/admin/DoctorVerificationScreen";
import { ReportGenerationScreen } from "./pages/admin/ReportGenerationScreen";
import { PathologyWorkflowQuickReferencePage } from "./pages/admin/PathologyWorkflowQuickReferencePage";
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { MyPatients } from "./pages/doctor/MyPatients";
import { UploadReports } from "./pages/doctor/UploadReports";
import { DoctorAppointments } from "./pages/doctor/DoctorAppointments";
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientBookTest } from "./pages/patient/PatientBookTest";
import { MyReports } from "./pages/patient/MyReports";
import { PatientAppointments } from "./pages/patient/PatientAppointments";
import { PaymentHistory } from "./pages/patient/PaymentHistory";
import { AdminBookingPage } from "./pages/admin/AdminBookingPage";
import { BookingManagementPage } from "./pages/admin/BookingManagementPage";
import { BookingTrackingPage } from "./pages/patient/BookingTrackingPage";
import { ServiceSelectionPage } from "./pages/booking/ServiceSelectionPage";
import { SearchPage } from "./pages/booking/SearchPage";
import { DetailsPage } from "./pages/booking/DetailsPage";
import { SlotSelectionPage } from "./pages/booking/SlotSelectionPage";
import { PatientInfoPage } from "./pages/booking/PatientInfoPage";
import { PaymentPage } from "./pages/booking/PaymentPage";
import { ConfirmationPage } from "./pages/booking/ConfirmationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AppErrorBoundary } from "./pages/AppErrorBoundary";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "book-test", element: <BookTestPage /> },
      { path: "track-report", element: <TrackReportPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <AppErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <AppErrorBoundary />,
  },
  {
    path: "/booking",
    element: <PublicLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      { path: "service-selection", element: <ServiceSelectionPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "details", element: <DetailsPage /> },
      { path: "slots", element: <SlotSelectionPage /> },
      { path: "patient-info", element: <PatientInfoPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "confirmation", element: <ConfirmationPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout role="admin" />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "doctors", element: <ManageDoctors /> },
      { path: "patients", element: <ManagePatients /> },
      { path: "test-categories", element: <TestCategories /> },
      { path: "reports", element: <ReportsManagement /> },
      { path: "appointments", element: <Appointments /> },
      { path: "booking", element: <AdminBookingPage /> },
      { path: "booking-management", element: <BookingManagementPage /> },
      { path: "payments", element: <Payments /> },
      { path: "analytics", element: <Analytics /> },
      { path: "sample-collection-queue", element: <SampleCollectionQueue /> },
      { path: "sample-collection/:id", element: <SampleCollectionScreen /> },
      { path: "sample-tracking", element: <SampleTrackingScreen /> },
      { path: "result-entry", element: <ResultEntryScreen /> },
      { path: "doctor-verification", element: <DoctorVerificationScreen /> },
      { path: "report-generation", element: <ReportGenerationScreen /> },
      { path: "pathology-workflow-quick-reference", element: <PathologyWorkflowQuickReferencePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/doctor",
    element: <DashboardLayout role="doctor" />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "patients", element: <MyPatients /> },
      { path: "upload-reports", element: <UploadReports /> },
      { path: "appointments", element: <DoctorAppointments /> },
    ],
  },
  {
    path: "/patient",
    element: <DashboardLayout role="patient" />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <PatientDashboard /> },
      { path: "book-test", element: <PatientBookTest /> },
      { path: "reports", element: <MyReports /> },
      { path: "appointments", element: <PatientAppointments /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "booking-tracking", element: <BookingTrackingPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <AppErrorBoundary />,
  },
]);