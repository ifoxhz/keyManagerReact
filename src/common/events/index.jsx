import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const IdleTimer = () => {
  const [timeoutId, setTimeoutId] = useState(null);
  const history = useHistory();

  const handleUserActivity = () => {
    // 用户有输入活动，重置计时器
    clearTimeout(timeoutId);
    startTimer();
  };

  const startTimer = () => {
    const id = setTimeout(() => {
      // 触发无输入逻辑，跳转到登录页面
      window.localStorage.islogin = '0'
      history.push('/login');
    }, 10 * 60 * 1000); // 10分钟（以毫秒为单位）

    setTimeoutId(id);
  };

  useEffect(() => {
    startTimer();

    // 组件挂载时添加事件监听器
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // 组件卸载时清除计时器和事件监听器
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []); // 只在组件挂载时执行一次

  return <div></div>;
};

export default IdleTimer;
