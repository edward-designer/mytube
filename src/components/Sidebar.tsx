import { cx } from "@/utils/helpers";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}

const Sidebar = ({ isOpen, setSidebarOpen, closeSidebar }: SidebarProps) => {
  return (
    <>
      <div
        className={cx([
          closeSidebar ? "lg:w-20" : "lg:w-56",
          "bottom-0 top-16 hidden bg-red-400 lg:fixed lg:z-40 lg:flex lg:flex-col",
        ])}
      >
        
      </div>
    </>
  );
};

export default Sidebar;
