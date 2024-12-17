import DashBoard from "./view/dashBoard";
import CustomAppBar from "./components/appBar";
import CommentsSection from "./components/CommentsSection";

export default function app() {
  return (
    <div>
      <CustomAppBar />
      <DashBoard />
    </div>
  );
}
