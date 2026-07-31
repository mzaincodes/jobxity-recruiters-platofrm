// "use client";

// import {

//   Sidebar,
//   Menu,
//   MenuItem,
//   SubMenu,
// } from "react-pro-sidebar";

// import mobileMenuData from "../../../data/mobileMenuData";
// import SidebarFooter from "./SidebarFooter";
// import SidebarHeader from "./SidebarHeader";
// import {
//   isActiveLink,
//   isActiveParentChaild,
// } from "../../../utils/linkActiveChecker";
// import { usePathname, useRouter } from "next/navigation";

// const Index = () => {

//   const router = useRouter()

//   return (
//     <div
//       className="offcanvas offcanvas-start mobile_menu-contnet"
//       tabIndex="-1"
//       id="offcanvasMenu"
//       data-bs-scroll="true"
//     >
//       <SidebarHeader />
//       {/* End pro-header */}

//         <Sidebar>
//           <Menu>
//             {mobileMenuData.map((item) => (
//               <SubMenu
//                 className={
//                   isActiveParentChaild(item.items, usePathname())
//                     ? "menu-active"
//                     : ""
//                 }
//                 label={item.label}
//                 key={item.id}
//               >
//                 {item.items.map((menuItem, i) => (
//                   <MenuItem

//                   onClick={()=>router.push(menuItem.routePath)}
//                     className={
//                       isActiveLink(menuItem.routePath, usePathname())
//                         ? "menu-active-link"
//                         : ""
//                     }
//                     key={i}
//                     // routerLink={<Link href={menuItem.routePath} />}
//                   >
//                     {menuItem.name}
//                   </MenuItem>
//                 ))}
//               </SubMenu>
//             ))}
//           </Menu>
//         </Sidebar>

//       <SidebarFooter />
//     </div>
//   );
// };

// export default Index;

"use client";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import SidebarHeader from "./SidebarHeader";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      <Sidebar>
        <Menu>
          {/* Static first-level menu items */}
          <MenuItem
            className={pathname === "/" ? "menu-active-link" : ""}
            onClick={() => router.push("/")}
          >
            Home
          </MenuItem>

          <MenuItem
            className={pathname.startsWith("/jobs") ? "menu-active-link" : ""}
            onClick={() => router.push("/job-list-v5")}
          >
            Jobs
          </MenuItem>

          <MenuItem
            className={pathname.startsWith("/about") ? "menu-active-link" : ""}
            onClick={() => router.push("/about")}
          >
            About
          </MenuItem>

          <MenuItem
            className={pathname.startsWith("/faq") ? "menu-active-link" : ""}
            onClick={() => router.push("/faq")}
          >
            FAQ's
          </MenuItem>
          <MenuItem
            className={pathname.startsWith("/faq") ? "menu-active-link" : ""}
            onClick={() => router.push("/faq")}
          >
           Dashboard
          </MenuItem>
        </Menu>
      </Sidebar>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          width: "200px",
          borderRadius: "8px",
          marginLeft: "20px",
          marginTop: "20px",
        }}
        className="theme-btn btn-style-one mm-listitem__text"
      >
        Logout
      </button>
      {/* <SidebarFooter /> */}
    </div>
  );
};

export default Index;
