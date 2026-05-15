import logo from './logo.png';
import background from './bgcimage.png';

import { Coins, FunnelPlus, LayoutDashboard, List, Wallet } from "lucide-react";
export const assets = {
  logo,
  background,
}

export const SIDE_BAR_DATA = [
  {
    id: "01",
    label: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Categories",
    icon: List,
    path: "/category",
  },
  {
    id: "03",
    label: "Earnings",
    icon: Wallet,
    path: "/income",
  },
  {
    id: "04",
    label: "Spendings",
    icon: Coins,
    path: "/expense",
  },
  {
    id: "05",
    label: "Analytics",
    icon: FunnelPlus,
    path: "/filter",
  },
];