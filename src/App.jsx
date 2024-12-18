import DashBoard from "./view/dashBoard";
import CustomAppBar from "./components/appBar";

export default function app() {
  return (
    <div>
      <CustomAppBar />
      <DashBoard />
    </div>
  );
}
