import "./ListPage.css";
import CategoryProgress from "./CategoryProgress";
import Featurelist from "./Featurelist";
import ListTable from "./ListTable";

export default function ListPage() {
  return (
    <div className="list-container">
      <div className="list-info">
        <CategoryProgress />
        <Featurelist />
      </div>
      <div className="list-table-box">
        <ListTable />
      </div>
    </div>
  );
}
