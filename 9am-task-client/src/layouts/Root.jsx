import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import React from "react";
import { Outlet } from "react-router";

const Root = () => {
  

  return (
    <div className="">
      {/* <Card className="p-6 w-full "> */}
      <Outlet />
      {/* </Card> */}
    </div>
  );
};

export default Root;
