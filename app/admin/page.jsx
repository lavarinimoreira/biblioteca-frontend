'use client'

import React from 'react';
import { withAuth } from '@/components/higher_order_component/withAuth';

const AdminPage = () => {
  return (
    <div>
      <h1>Página Administrativa</h1>
      <p>Bem-vindo, { /* informações do usuário */ }</p>
      {/* Conteúdo protegido */}
    </div>
  );
};

export default withAuth(AdminPage, 'admin.create');
