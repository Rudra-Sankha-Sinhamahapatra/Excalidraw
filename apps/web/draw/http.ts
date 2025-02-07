export async function getExistingShapes(messages: { message: string }[]) {
    const shapes = messages.map((message: { message: string }) => {
      const messageData = JSON.parse(message.message);
      return messageData;
    });
  
    return shapes;
  }
  