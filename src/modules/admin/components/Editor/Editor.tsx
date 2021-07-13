import React, { useCallback, useEffect, useRef, FormEvent, useState } from 'react';
import { Editor as ToastUIReactEditor } from '@toast-ui/react-editor';
import { EditorStyled } from './Editor.styles';
import FileUtils from './utils/FileUtils';
import { Box } from '@chakra-ui/react';
import UploadingModal from './uploadingModal';
import { EditorFullGlobal } from './Editor.fullstyles';
import { EditPropertyProps } from 'admin-bro';
import axios from 'axios';

interface EditorProps {
  property: EditPropertyProps['property'];
  record: EditPropertyProps['record'];
  onChange: EditPropertyProps['onChange'];
}

const bucketPath = 'portfolios/images';

const Editor = (props: EditorProps) => {
  const editorRef = useRef<ToastUIReactEditor>(null);
  const [isUploading, setIsUploading] = useState(false);
  const removeAllBrTag = (str?: string) => str?.replaceAll(/<br[^>]*><br>/g, '') || '';
  const { property, record, onChange } = props;
  const isReadOnly = !onChange;

  const getImageUrls = useCallback(() => {
    const images = Array.from(document.querySelectorAll('.te-editor img')) as HTMLImageElement[];
    return images.map((image) => image.src);
  }, []);

  const handleChange = useCallback(() => {
    const editor = editorRef.current?.getInstance();
    const contents = removeAllBrTag(editor?.getHTML());
    onChange(property?.path, contents);
  }, [onChange, property]);

  const onImageChanged = useCallback(async (file: File, renderImage: (imageUrl: string, altText: string) => any) => {
    setIsUploading(true);
    const compressedFile = await FileUtils.compressFile(file);
    const imageUrl = (await axios.post('/admin/image', { bucketPath, file: compressedFile })).data;
    renderImage(imageUrl, '피드 이미지');
    setIsUploading(false);
  }, []);

  const attachImageChangeHandler = useCallback(() => {
    const editor = editorRef.current?.getInstance();
    editor && editor.addHook('addImageBlobHook', onImageChanged);
  }, [onImageChanged]);

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

export default Editor;
