import { Outlet } from "react-router-dom";
import { TopAppBar } from "./TopAppBar";

export default function DashboardLayout() {
  return (
    <div className="min-h-dvh bg-background text-on-background">
      <TopAppBar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
