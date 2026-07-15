import React from "react";
import CH1_page from "../Components/CH1_Letter/CH1_page";
import CH2_page from "../Components/CH2_Location/CH2_page";
import CH3_page from "../Components/CH3_SitePlan/CH3_page";
import CH4_page from "../Components/CH4_FloorPlan/CH4_page";
import CH4Menu_page from "../Components/CH4_FloorPlan/Menu/CH4_Menu_page";

import { CH4FloorPlanProvider } from "../Context/CH4_FloorPlan_Context";
import CH5_page from "../Components/CH5_IMAX/CH5_page";
import CH6_page from "../Components/CH6_Gallery/CH6_page";

export default function HomePage() {
  return (
    <CH4FloorPlanProvider>
      <div className="h-screen  snap-y snap-proximity overflow-y-scroll">
        <section className="h-screen snap-start bg-green-400">
          <CH1_page />
        </section>

        {/* <CH2_page/> */}

        <section className="h-screen snap-start">
          <CH2_page />
        </section>

        <section className="h-screen snap-start bg-blue-400">
          <CH3_page />
        </section>

        <section className="h-screen snap-start bg-red-400">
          <CH4_page />
        </section>

        <section className="h-screen snap-start ">
          <CH5_page />
        </section>

        <section className="h-screen snap-start ">
          <CH6_page />
        </section>

        <CH4Menu_page />
      </div>
    </CH4FloorPlanProvider>
  );
}
