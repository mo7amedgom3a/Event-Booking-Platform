import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import AppLayout from "@/components/layout/AppLayout";
import { ProtectedRoute, OrganizerRoute } from "@/components/routes/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import OrganizerDashboard from "@/pages/OrganizerDashboard";
import CreateEventPage from "@/pages/CreateEventPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <EventProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/bookings" element={<MyBookingsPage />} />
                </Route>

                {/* Organizer */}
                <Route element={<OrganizerRoute />}>
                  <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/:id/edit" element={<CreateEventPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </EventProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
