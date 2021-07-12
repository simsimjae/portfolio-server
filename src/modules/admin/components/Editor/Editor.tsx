import React, { useCallback, useEffect, useRef, FormEvent, useState } from 'react';
import { Editor as ToastUIReactEditor } from '@toast-ui/react-editor';
import { EditorResetCss, EditorStyled } from './Editor.styles';
import FileUtils from './utils/FileUtils';
import { Box, Flex, Icon, IconButton, Img, Input } from '@chakra-ui/react';
import UploadingModal from './uploadingModal';
import { EditorFullGlobal } from './Editor.fullstyles';
import { FaCheck } from 'react-icons/fa';

interface EditorProps {
  /** 에디터의 내용을 서버에 업로드 할때 사용합니다. */
  onSubmit?: ({ title, contents, imageUrls }: { title: string; contents?: string; imageUrls: string[] }) => any;
  onLeftButtonClick?: (...p: any) => any;
  initialValue?: { title?: string; contents?: string };
  /** 컨테이너 컴포넌트에서 아래 함수 Override해서 서버로 이미지 업로드 */
  onImageChanged?: (file: File, renderImage: (imageUrl: string, altText: string) => any) => Promise<any>;
  /** 이미지 업로드 중일때 */
  isUploading?: boolean;
  /** 토스트 에디터 툴바가 필요한 경우 */
  hasToastToolbar?: boolean;
}

const Editor = (props: EditorProps) => {
  const editorRef = useRef<ToastUIReactEditor>(null);
  const [title, setTitle] = useState(props.initialValue?.title || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const removeAllBrTag = (str?: string) => str?.replaceAll(/<br[^>]*><br>/g, '') || '';

  useEffect(() => {
    setIsUploading(props.isUploading!);
  }, [props.isUploading]);

  const getImageUrls = useCallback(() => {
    const images = Array.from(document.querySelectorAll('.te-editor img')) as HTMLImageElement[];
    return images.map((image) => image.src);
  }, []);

  /** 에디터 모달 작성 완료 버튼 클릭시 */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const editor = editorRef.current?.getInstance();
    const contents = removeAllBrTag(editor?.getHTML());
    props.onSubmit && (await props.onSubmit({ title, contents, imageUrls: getImageUrls() }));
    setIsSubmitting(false);
  }, [props.onSubmit, title]);

  const onImageChanged = useCallback(async (file: File, renderImage: (imageUrl: string, altText: string) => any) => {
    setIsUploading(true);
    const compressedFile = await FileUtils.readFileAsDataURL(file);
    setIsUploading(false);
    renderImage(compressedFile!, '피드 이미지');
  }, []);

  const attachImageChangeHandler = useCallback(() => {
    const editor = editorRef.current?.getInstance();
    editor && editor.addHook('addImageBlobHook', props.onImageChanged ? props.onImageChanged : onImageChanged);
  }, [props.onImageChanged]);

  useEffect(() => {
    attachImageChangeHandler();
  }, []);

  return (
    <EditorStyled>
      <Box h="full" className="div100vh" position="relative">
        <Input placeholder="제목을 입력해주세요" _placeholder={{ color: '#A0AEC0' }} w="full" value={title} onChange={(e) => setTitle(e.target.value)} rounded="0" mb="-1px" px="6" size="lg" fontWeight="500" />
        <ToastUIReactEditor initialEditType="wysiwyg" height="100%" initialValue={removeAllBrTag(props.initialValue?.contents)} ref={editorRef!} placeholder="본문을 입력해주세요" />
        {props.hasToastToolbar ? <EditorFullGlobal /> : <EditorResetCss />}
        <UploadingModal isOpen={isUploading} />
        <IconButton onClick={handleSubmit} isLoading={isSubmitting} icon={<FaCheck size="24px" />} aria-label="게시글 작성 완료 버튼" position="absolute" right="4" bottom="12" rounded="50%" size="xl" colorScheme="purple" />
      </Box>
    </EditorStyled>
  );
};

Editor.defaultProps = {
  onLeftButtonClick: () => console.log('왼쪽 버튼 클릭됨'),
  onSubmit: (contents: string) => console.log(contents),
  isUploading: false,
  hasToastToolbar: false,
};

export default Editor;
