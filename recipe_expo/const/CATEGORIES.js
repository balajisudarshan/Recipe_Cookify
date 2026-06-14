import AllFoodIcon from "../icons/AllFoodIcon"; // Make sure this path points to your icon file
import BreakFastIcon from "../icons/BreakFastIcon";
import DinnerIcon from "../icons/DinnerIcon";
import LunchIcon from "../icons/LunchIcon";
import SnacksIcon from "../icons/SnacksIcon";

export const CATEGORIES = [
  {
    id: "1",
    title: "All",
    bg: "#FFF2E0",
    border: "#FFD090",
    icon: AllFoodIcon,
  },
  {
    id: "2",
    title: "BreakFast",
    bg: "#FFEBEA",
    border: "#FFC4C1",
    icon: BreakFastIcon, 
  },
  {
    id: "3",
    title: "Lunch",
    bg: "#FCEEFF",
    border: "#EFAFFF",
    icon: LunchIcon, 
  },
  {
    id: "4",
    title: "Dinner",
    bg: "#f0fbff",
    border: "#00bef8",
    icon: DinnerIcon, 
  },
  {
    id: "5",
    title: "Snacks",
    bg: "#e5ffeb",
    border: "#00ac28",
    icon: SnacksIcon, 
  },
  
];

export default CATEGORIES;