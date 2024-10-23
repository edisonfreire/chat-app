// "use client";
// import { useState } from "react";
// import { Drawer, Button } from "antd";
// import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"; // Import icons
// import ChatArea from "./_chat-components/chat-area";
// import Chats from "./_chat-components/chats";
// import { Divider } from "antd";

// export default function Home() {
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);

//   const toggleDrawer = () => {
//     setIsDrawerVisible(!isDrawerVisible);
//   };

//   return (
//     <div className='flex h-[89vh]'>
//       {/* Toggle Button for smaller screens */}
//       <Button 
//         className="md:hidden" 
//         onClick={toggleDrawer} 
//         icon={isDrawerVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} // Icons for open/close
//       >
//       </Button>

//       {/* Drawer for mobile view */}
//       <Drawer
//         title="Chats"
//         placement="left"
//         closable={true}
//         onClose={toggleDrawer}
//         open={isDrawerVisible}
//         width={400}
//         className="md:hidden overflow-x-hidden"
//         bodyStyle={{ padding: 0 }}
//       >
//         <Chats />
//       </Drawer>

//       {/* Chats sidebar for larger screens */}
//       <div className="hidden md:block w-[400px]">
//         <Chats />
//       </div>
      
//       <Divider 
//         type='vertical'
//         className="h-full border-gray-300 px-0 mx-0"
//       />
      
//       <ChatArea />
//     </div>
//   );
// }

"use client";
import ChatArea from "./_chat-components/chat-area";
import Chats from "./_chat-components/chats";
import { Divider } from "antd";

export default function Home() {
  return (
    <div className='flex h-[89vh]'>
      <Chats />
      <Divider 
        type='vertical'
        className="h-full border-gray-300 px-0 mx-0"
      />
      <ChatArea />
    </div>
  );
}
