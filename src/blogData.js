import img from "../src/assets/images/zang.jpg";
import sustain1 from "./assets/images/blogs/Sustainable Manufaturing/img1.jpg"
import sustain2 from "./assets/images/blogs/Sustainable Manufaturing/img2.jpg"
import sustain3 from "./assets/images/blogs/Sustainable Manufaturing/img3.jpg"

import circular1 from "./assets/images/blogs/Circular Economy/img1.jpg"
import circular2 from "./assets/images/blogs/Circular Economy/img2.jpg"
import circular3 from "./assets/images/blogs/Circular Economy/img3.jpg"

import footmouse1 from "./assets/images/blogs/Computer foot mouse/img1.JPG"
import footmouse2 from "./assets/images/blogs/Computer foot mouse/img2.jpg"




import img2 from "../src/assets/images/review.jpg";

const blogs = [
  // Existing blogs...

  // New Blog 1: Sustainable Manufacturing
  {
    id: 11,
    title: "Sustainable Manufacturing",
    description:
      "At Zang Global, we are committed to sustainable manufacturing practices that prioritize environmental stewardship and resource efficiency.",
    content:
      "Transforming electronic waste into innovative products like power banks, solar lanterns, USB cables, and mobile phone chargers to reduce waste and contribute to a circular economy.",
    thumbnail: sustain1,
    images: [sustain2, sustain3],  // Example of other images
  },

  // New Blog 2: Circular Economy
  {
    id: 12,
    title: "Circular Economy",
    description:
      "E-waste refers to discarded electrical or electronic devices, which are often improperly disposed of, leading to environmental hazards.",
    content:
      "We are adopting circular economy principles to mitigate the e-waste crisis. By recycling, repurposing, and transforming e-waste into valuable resources, we help reduce environmental impact. Recycling e-waste into power banks and solar lanterns exemplifies how circular models can create new products while reducing environmental impact.",
    thumbnail: circular1,
    images: [circular2, circular3],  // Example of other images
  },

  // New Blog 3: The Role of Circular Economy in E-Waste Management
  {
    id: 13,
    title: "The Role of Circular Economy in E-Waste Management",
    description:
      "Circular economy principles are key to solving the global e-waste crisis by recycling and repurposing discarded electronics.",
    content:
      "We are committed to the circular economy as it plays a critical role in mitigating the e-waste crisis. By embracing recycling, repurposing, and transforming e-waste into valuable products, we contribute to a more sustainable future. The circular economy not only reduces environmental hazards but also creates new opportunities for innovation, benefiting both society and the planet. Recycling e-waste into power banks and solar lanterns is a prime example of how circular models can create new products and reduce environmental impact.",
    thumbnail: img,
    images: [img, img2],  // Example of other images
  },
  {
    id: 1,
    title: "The Computer Foot Mouse",
    description: "An innovative solution designed for individuals with disabilities, particularly amputees, to interact with computers using foot movements, enhancing independence and accessibility.",
    content: `
      The Computer Foot Mouse is an innovative device designed to improve the lives of individuals with disabilities, especially amputees. This technology allows users to interact with computers using foot movements, providing them with greater independence and access to digital tools for education, employment, and social interaction.
      This solution is aimed at creating a more inclusive and equitable society by ensuring that individuals of all abilities can engage with the digital world. By providing adaptive tools, we break down barriers and promote independence.
    `,
    thumbnail: footmouse1,
    images: [footmouse1, footmouse2],
  }
  
];

export default blogs;