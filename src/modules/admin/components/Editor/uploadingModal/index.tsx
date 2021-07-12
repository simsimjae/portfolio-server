import { Modal, ModalOverlay, ModalContent, ModalBody, Flex, CircularProgress, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

interface Props {
  loadingText?: string;
  isOpen: boolean;
}

const UploadingModal = (props: Props) => {
  const { onClose } = useDisclosure();

  return (
    <Modal isOpen={props.isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay zIndex="modal">
        <ModalContent background="transparent" boxShadow="none">
          <ModalBody>
            <Flex direction="column" justify="center" align="center">
              <CircularProgress isIndeterminate color="green.300" thickness="6px" />
              <Text mt="4" color="white">
                {props.loadingText}
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

UploadingModal.defaultProps = {
  loadingText: '이미지를 업로드중입니다',
  isOpen: false,
};

export default UploadingModal;
