import React, { useEffect, useState } from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar(props) {
  const { isAuthenticated, isLoading } = useAuth();
  const [navbarProps, setNavbarProps] = useState(props);

  useEffect(() => {
    // Clone the props to modify items based on auth status
    const modifiedProps = { ...props };

    if (modifiedProps?.children?.props?.items) {
      // Modify items based on authentication status
      const filteredItems = modifiedProps.children.props.items.map(item => {
        // For docSidebar and internal links, disable if not authenticated
        if (!isAuthenticated && (item.type === 'docSidebar' ||
            item.to === '/blog' ||
            item.to?.startsWith('/docs'))) {
          // Make the item appear disabled but still visible
          return {
            ...item,
            className: `${item.className || ''} navbar-item-disabled`.trim(),
            style: { ...item.style, opacity: 0.5, pointerEvents: 'none' }
          };
        }
        return item;
      });

      // Update the items
      modifiedProps.children = React.cloneElement(props.children, {
        ...props.children.props,
        items: filteredItems
      });
    }

    setNavbarProps(modifiedProps);
  }, [isAuthenticated, isLoading, props]);

  return <OriginalNavbar {...navbarProps} />;
}