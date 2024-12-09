import {
  Badge,
  Box,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
  }
  

interface NotificationMenuProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

  
const NotificationMenu: React.FC<NotificationMenuProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
// Add debug logging
useEffect(() => {
    try {
      console.log('Safe notification data:', 
        notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          isRead: n.isRead,
          type: n.type
        }))
      );
    } catch (error) {
      console.error('Notification parsing error:', error);
    }
  }, [notifications]);
  return (
      <PopoverRoot>
          <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" p={1}>
                  <Box position="relative">
                      <FaBell size={20} />
                      {unreadCount > 0 && (
                          <Badge
                              position="absolute"
                              top="-1"
                              right="-1"
                              colorScheme="red"
                              borderRadius="full"
                              minW="18px"
                              textAlign="center"
                          >
                              {unreadCount}
                          </Badge>
                      )}
                  </Box>
              </Button>
          </PopoverTrigger>

          <PopoverContent w="350px" maxH="500px" overflowY="auto">
              <PopoverArrow />
              <PopoverHeader borderBottomWidth="1px">
                  <HStack justify="space-between">
                      <Text fontWeight="bold">Notifications</Text>
                      {unreadCount > 0 && (
                          <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="teal"
                              onClick={onMarkAllAsRead}
                          >
                              Mark all as read
                          </Button>
                      )}
                  </HStack>
              </PopoverHeader>
              <PopoverBody p={0}>
                  <VStack align="stretch" gap={0}>
                      {notifications.length === 0 ? (
                          <Box p={4} textAlign="center" color="gray.500">
                              No notifications
                          </Box>
                      ) : (
                          notifications.map((notification) => (
                              <Box
                                  key={notification.id}
                                  p={4}
                                  borderBottomWidth="1px"
                                  bg={notification.isRead ? "white" : "gray.50"}
                                  _hover={{ bg: "gray.100" }}
                                  cursor="pointer"
                                  onClick={() => onMarkAsRead(notification.id)}
                              >
                                  <Text fontWeight="medium" fontSize="sm">
                                      {notification.title}
                                  </Text>
                                  <Text fontSize="sm" color="gray.600" mt={1}>
                                      {notification.message}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500" mt={2}>
                                      {notification.timestamp}
                                  </Text>
                              </Box>
                          ))
                      )}
                  </VStack>
              </PopoverBody>
          </PopoverContent>
      </PopoverRoot>
  );
};

export { NotificationMenu, type Notification };