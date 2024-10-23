"use client";
import React from 'react'
import Header from './layout-components/header';
import Content from './layout-components/content';

const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <Content>
        {children}
      </Content>
    </div>
  )
}

export default LayoutProvider;