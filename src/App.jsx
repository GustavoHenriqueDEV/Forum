import DashBoard from "./view/dashBoard";
import CustomAppBar from "./components/appBar";
import AuthPage from "./components/AuthPage";

export default function app() {
  return (
    <div>
      <CustomAppBar />
      <DashBoard />
      <AuthPage />
    </div>
  );
}
