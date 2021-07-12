import styled, { createGlobalStyle } from 'styled-components';

export const EditoryRenderStyled = styled.div`
  p {
    line-height: 1.5;
    margin: 16px 0;
  }
  img {
    margin: 16px 0;
  }
`;

export const EditorStyled = styled.div`
  flex: 1;

  .div100vh {
    display: flex;
    flex-direction: column;
    background: white;
    height: 100%;
  }
  .title-input {
    padding: 8px 16px;
    outline: none;
    border-bottom: 1px solid #eee;
    &::placeholder {
      color: #ccc;
    }
  }
  .te-editor {
    &::placeholder {
      color: #ccc;
    }
    .tui-editor-contents {
      font-size: 18px;
    }
  }
  .tui-editor-contents h1,
  .tui-editor-contents h2,
  .tui-editor-contents h3,
  .tui-editor-contents h4 {
    border-bottom: none;
  }
  .tui-editor-contents-placeholder::before {
    color: #a0aec0;
  }
  .toolbar {
    display: flex;
    padding: 8px 16px;
    border: 1px solid #d3d3d3;
    background-color: #fafafa;
    height: 40px;
    box-sizing: border-box;
    align-items: center;
  }
  .toolbar_item {
    height: auto;
    label {
      display: flex;
    }
  }
  .tui-editor-defaultUI {
    img {
      width: 100%;
      max-width: 500px;
      margin: auto;
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
  .te-mode-switch-section {
    display: none !important;
  }
  .blind {
    position: absolute !important;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
  }
`;

export const EditorResetCss = createGlobalStyle`
	.auto-height {
		flex: 1;
		height: 0 !important;
	}

	.te-mode-switch-section,
	.te-toolbar-section,
	.te-preview-style-tab,
	.CodeMirror,
	.CodeMirror-wrap,
	.te-md-container,
	.tui-editor-defaultUI-toolbar {
		display: none !important;
	}
	.tui-editor-defaultUI,
	.te-editor-section,
	.tui-editor,
	.te-ww-container,
	.te-editor {
		height: 100%;
	}
	.tui-editor-contents {
		outline: none;
		height: 100%;
		padding: 16px;
		line-height: 1.5;
		overflow: auto;
	}
`;
