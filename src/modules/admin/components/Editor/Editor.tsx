import React, { useCallback, useEffect, useRef, FormEvent, useState } from 'react';
import { Editor as ToastUIReactEditor } from '@toast-ui/react-editor';
import { EditorStyled } from './Editor.styles';
import FileUtils from './utils/FileUtils';
import { Box, Text, IconButton, Img, Input } from '@chakra-ui/react';
import UploadingModal from './uploadingModal';
import { EditorFullGlobal } from './Editor.fullstyles';
import { EditPropertyProps } from 'admin-bro';

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
  property: EditPropertyProps['property'];
  record: EditPropertyProps['record'];
  onChange: EditPropertyProps['onChange'];
}

const Editor = (props: EditorProps) => {
  const editorRef = useRef<ToastUIReactEditor>(null);
  const [isUploading, setIsUploading] = useState(false);
  const removeAllBrTag = (str?: string) => str?.replaceAll(/<br[^>]*><br>/g, '') || '';
  const { property, record, onChange } = props;
  const isReadOnly = !onChange;

  useEffect(() => {
    setIsUploading(props.isUploading!);
  }, [props.isUploading]);

  const getImageUrls = useCallback(() => {
    const images = Array.from(document.querySelectorAll('.te-editor img')) as HTMLImageElement[];
    return images.map((image) => image.src);
  }, []);

  /** 에디터 모달 작성 완료 버튼 클릭시 */
  // const handleSubmit = useCallback(async () => {
  //   setIsSubmitting(true);
  //   const editor = editorRef.current?.getInstance();
  //   const contents = removeAllBrTag(editor?.getHTML());
  //   props.onSubmit && (await props.onSubmit({ title, contents, imageUrls: getImageUrls() }));
  //   setIsSubmitting(false);
  // }, [props.onSubmit, title]);

  const handleChange = useCallback(() => {
    const editor = editorRef.current?.getInstance();
    const contents = removeAllBrTag(editor?.getHTML());
    onChange(property?.path, contents);
  }, [onChange, property]);

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
      <h3 className="title">{property?.label}</h3>
      <Box h="full" className="div100vh" position="relative">
        {isReadOnly && <Box dangerouslySetInnerHTML={{ __html: record.params?.contents }}></Box>}
        {!isReadOnly && <ToastUIReactEditor initialEditType="wysiwyg" height="100%" initialValue={removeAllBrTag(record.params?.contents)} ref={editorRef!} placeholder="본문을 입력해주세요" onChange={handleChange} />}
        <EditorFullGlobal />
        <UploadingModal isOpen={isUploading} />
      </Box>
    </EditorStyled>
  );
};

Editor.defaultProps = {
  onLeftButtonClick: () => console.log('왼쪽 버튼 클릭됨'),
  onSubmit: (contents: string) => console.log(contents),
  isUploading: false,
  hasToastToolbar: true,
};

export default Editor;
