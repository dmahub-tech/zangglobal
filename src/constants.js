import image from "./assets/images/review.jpg"
import FederalGovernment from "./assets/images/partners/FederalGovernment.png";
import Amahoro from "./assets/images/partners/Amahoro.png";
import Plasmida from "./assets/images/partners/Plasmida.png";
import WesternUnion from "./assets/images/partners/WesternUnionFoundation.png";
import WatsonInstitute from "./assets/images/partners/WatsonInstitute.png";
import Ecowas from "./assets/images/partners/Ecowas.png";
import EnergyGlobe from "./assets/images/partners/EnergyGlobe.png";
import Ariel from "./assets/images/partners/ActionforRefugeeLife.png";
import NationalWinner from "./assets/images/partners/nationalWinner2022_Nigeria.png";
import unsung from "./assets/images/partners/Unsung.png";
import future from "./assets/images/partners/future.png";
import inovative from "./assets/images/partners/MostInnovativeTech.png";
import msme from "./assets/images/partners/MSME.jpg";

import meshak from "../public/meshak.jpeg"
import benny from "../public/benny.jpeg"
import  idoko from "../public/idoko.jpeg"

import sarah from "./assets/images/teams/sarah.png"
import friday from "./assets/images/teams/friday.png"
import vivian from "./assets/images/teams/vivian.png"
import lyop from "./assets/images/teams/lyop.png"
import luka from "./assets/images/teams/luka.png"


export const whyUs = [
    {
        id: 1,
        title: "RELIABILITY",
    },
    {
        id: 2,
        title: "PERSONALIZED APPROACH",
    },
    {
        id: 3,
        title: "TIMELY DELIVERY",
    },
    {
        id: 4,
        title: "HIGH STANDARDS",
    }
]


export const progress = [
    {
        id: 1,
        progress: "",
        title: "RELIABILITY",
    },
    {
        id: 2,
        progress: 8,

        title: "Year in Operation",
    },
    {
        id: 3,
        progress: 30,

        title: "Offices Nationwide",
    },

]



export const testimonialData = [
  {
    img: meshak,
    name: "Mr. Meshak Chetle ",
    statement:
      "The Zang USB and Powerbank provide reliable performance and exceptional durability, making them indispensable for both office and field operations.",
    services: "MD/CEO Prominent Biiman Technologies Limited",
  },
  {
    img: benny,
    name: "Benny",
    statement:
      " I have used the renowned indigenous Zang Global Power Bank for the past three years, and the experience has been outstanding, consistent performance and full capacity every time. I highly recommend it to anyone.",
    services: "Customer",
  },
  {
    img: idoko,
    name: "Idoko Negedu",
    statement:
      "Discovering the Zang brand and using their products over the past two years has completely reshaped my view of Nigerian-made innovations. For quality, reliability, durability, affordability, and exceptional customer service, Zang Global truly delivers. I recommend their products with complete confidence—100% guaranteed.",
    services: "Customer",
  },
];



export const partnerAwardData = {
    partners: [
        { name: "Federal Government of Nigeria", image: FederalGovernment },
        { name: "Amahoro", image: Amahoro },
        { name: "Plateau State Microfinance Development Agency (PLASMIDA)", image: Plasmida },
        { name: "Western Union Foundation", image: WesternUnion },
        { name: "Watson Institute USA", image: WatsonInstitute },
        { name: "ECOWAS", image: Ecowas },
        { name: "Energy Globe", image: EnergyGlobe },
        { name: "Ariel", image: Ariel }
      ],
      awards: [
        { title: "Energy Globe National Award", year: 2022, image: NationalWinner },
        { title: "Most Innovative Tech Environmental Solutions", year: 2022, organization: "Alphablue Foundation", image: inovative },
        { title: "Startup Award", year: 2021, organization: "ECOWAS", image: Ecowas },
        { title: "Unsung Heroes Award", year: 2019, image: unsung },
        { title: "National MSMEs Award of Excellence in Technology Innovation", year: 2019, image: msme },
        { title: "The Future Awards Africa Prize for Technology", year: 2019, image: future }
      ]

  };
  


  export const teamMembers = [
    { name: "Zang Luka", title: "Founder and CEO", image: luka },
    { name: "Lyop Samson", title: "Co-Founder", image: lyop },
    { name: "Vivian Daniel", title: "Operations Manager", image: vivian },
    { name: "Sarah Mafulul", title: "Financial Officer", image: sarah },
    { name: "Friday Mamman", title: "Auditor", image: friday }
  ];