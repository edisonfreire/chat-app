'use client';
import React from 'react'
import { ConfigProvider } from 'antd';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // https://ant.design/docs/react/customize-theme
    // overriding default antd styles
    <ConfigProvider
      theme={{
        // all components / global level
        token: {
          colorPrimary: "#31304D",
          borderRadius: 2,
        },
        // specific components
        components: {
          Button: {
            controlHeight: 45,
            boxShadow: "none",
            colorPrimaryHover: "#31304D",
            controlOutline: "none",
            colorBorder: "#31304D",
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;