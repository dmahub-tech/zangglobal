import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Upload,
  X,
  Loader2,
  EyeOff,
  Maximize,
  Minimize,
  Check,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Strikethrough,
  Indent,
  Link,
  Eye,
  Outdent,
  Superscript,
  Palette,
  RotateCcw,
  Subscript,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../config/api";

// Enhanced CustomTextEditor Component
const CustomTextEditor = React.memo(
  ({
    value = "",
    onChange,
    placeholder = "Start writing...",
    height = "300px",
    disabled = false,
    showWordCount = true,
    maxLength,
    className = "",
    onAutoSave,
  }) => {
    const editorRef = useRef(null);
    const colorPickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const autoSaveTimeoutRef = useRef(null);

    // State management
    const [history, setHistory] = useState([value || ""]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [activeFormats, setActiveFormats] = useState(new Set());
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Memoized values
    const isUndoDisabled = useMemo(() => historyIndex <= 0, [historyIndex]);
    const isRedoDisabled = useMemo(
      () => historyIndex >= history.length - 1,
      [historyIndex, history.length]
    );

    // Colors for text and background
    const colors = [
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#CCCCCC",
      "#FFFFFF",
      "#FF0000",
      "#FF6600",
      "#FFCC00",
      "#00FF00",
      "#0066FF",
      "#6600FF",
      "#FF0066",
      "#FF3366",
      "#66FF33",
      "#33CCFF",
      "#9933FF",
      "#FF9933",
    ];

    // Content sanitization function
    const sanitizeContent = useCallback((content) => {
      // Basic XSS protection - remove script tags and dangerous attributes
      return content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+="[^"]*"/g, "")
        .replace(/javascript:/gi, "");
    }, []);

    // Update word and character counts
    const updateCounts = useCallback((content) => {
      const text = content.replace(/<[^>]*>/g, "");
      setCharCount(text.length);
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    }, []);

    // Auto-save functionality
    const triggerAutoSave = useCallback(
      (content) => {
        if (!onAutoSave) return;

        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
          onAutoSave(content);
        }, 2000);
      },
      [onAutoSave]
    );

    // Update history when value changes externally
    useEffect(() => {
      if (value !== history[historyIndex]) {
        const newHistory = [...history.slice(0, historyIndex + 1), value];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        updateCounts(value);
      }
    }, [value, history, historyIndex, updateCounts]);

    // Update editor content when value changes
    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
        updateCounts(value);
      }
    }, [value, updateCounts]);

    // Cleanup auto-save timeout
    useEffect(() => {
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }, []);

    // Add to history with debouncing
    const addToHistory = useCallback(
      (content) => {
        setHistory((prev) => {
          const newHistory = [...prev.slice(0, historyIndex + 1), content];
          // Limit history size to prevent memory issues
          if (newHistory.length > 50) {
            return newHistory.slice(-50);
          }
          return newHistory;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 49));
      },
      [historyIndex]
    );

    // Execute formatting commands
    const executeCommand = useCallback(
      (command, value = null) => {
        if (disabled) return;

        editorRef.current?.focus();

        try {
          document.execCommand(command, false, value);
          const newContent = sanitizeContent(
            editorRef.current?.innerHTML || ""
          );
          onChange?.(newContent);
          updateActiveFormats();
          updateCounts(newContent);
          triggerAutoSave(newContent);
        } catch (error) {
          console.warn("Command execution failed:", command, error);
        }
      },
      [disabled, onChange, updateCounts, sanitizeContent, triggerAutoSave]
    );

    // Update active formatting states
    const updateActiveFormats = useCallback(() => {
      if (!editorRef.current) return;

      const formats = new Set();

      try {
        if (document.queryCommandState("bold")) formats.add("bold");
        if (document.queryCommandState("italic")) formats.add("italic");
        if (document.queryCommandState("underline")) formats.add("underline");
        if (document.queryCommandState("strikeThrough"))
          formats.add("strikethrough");
        if (document.queryCommandState("justifyLeft")) formats.add("alignLeft");
        if (document.queryCommandState("justifyCenter"))
          formats.add("alignCenter");
        if (document.queryCommandState("justifyRight"))
          formats.add("alignRight");
        if (document.queryCommandState("insertUnorderedList"))
          formats.add("bulletList");
        if (document.queryCommandState("insertOrderedList"))
          formats.add("numberedList");
      } catch (error) {
        console.warn("Error checking command states:", error);
      }

      setActiveFormats(formats);
    }, []);

    // Handle input changes
    const handleInput = useCallback(() => {
      if (disabled) return;

      const content = sanitizeContent(editorRef.current?.innerHTML || "");

      // Check max length
      if (maxLength) {
        const textContent = content.replace(/<[^>]*>/g, "");
        console.log(textContent)
        if (textContent.length > maxLength) {
          return;
        }

      }

      onChange?.(content);
      updateCounts(content);
      updateActiveFormats();
      triggerAutoSave(content);

      // Add to history with debouncing
      const timeoutId = setTimeout(() => {
        addToHistory(content);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [
      disabled,
      maxLength,
      onChange,
      updateCounts,
      updateActiveFormats,
      addToHistory,
      sanitizeContent,
      triggerAutoSave,
    ]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
      (e) => {
        if (disabled) return;

        const { ctrlKey, metaKey, key, shiftKey } = e;
        const isCtrl = ctrlKey || metaKey;

        if (isCtrl) {
          switch (key.toLowerCase()) {
            case "b":
              e.preventDefault();
              executeCommand("bold");
              break;
            case "i":
              e.preventDefault();
              executeCommand("italic");
              break;
            case "u":
              e.preventDefault();
              executeCommand("underline");
              break;
            case "z":
              e.preventDefault();
              if (shiftKey) {
                redo();
              } else {
                undo();
              }
              break;
            case "y":
              e.preventDefault();
              redo();
              break;
            case "k":
              e.preventDefault();
              insertLink();
              break;
            case "enter":
              e.preventDefault();
              togglePreview();
              break;
            case "s":
              e.preventDefault();
              if (onAutoSave) {
                onAutoSave(editorRef.current?.innerHTML || "");
              }
              break;
          }
        }

        if (key === "Tab") {
          e.preventDefault();
          if (shiftKey) {
            executeCommand("outdent");
          } else {
            executeCommand("indent");
          }
        }
      },
      [disabled, executeCommand, onAutoSave]
    );

    // Undo/Redo functions
    const undo = useCallback(() => {
      if (isUndoDisabled) return;

      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      onChange?.(content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }, [isUndoDisabled, historyIndex, history, onChange]);

    const redo = useCallback(() => {
      if (isRedoDisabled) return;

      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      onChange?.(content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }, [isRedoDisabled, historyIndex, history, onChange]);

    // Link insertion with validation
    const insertLink = useCallback(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString();
      const url = prompt("Enter URL:", "https://");

      if (url && url.trim()) {
        // Basic URL validation
        try {
          new URL(url);
          if (selectedText) {
            executeCommand("createLink", url);
          } else {
            const linkText = prompt("Enter link text:") || url;
            const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            executeCommand("insertHTML", linkHtml);
          }
        } catch (error) {
          alert("Please enter a valid URL");
        }
      }
    }, [executeCommand]);

    // Image insertion with compression
    const insertImage = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const compressImage = useCallback((file, maxWidth = 800, quality = 0.8) => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(resolve, "image/jpeg", quality);
        };

        img.src = URL.createObjectURL(file);
      });
    }, []);

    const handleImageUpload = useCallback(
      async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type.startsWith("image/")) {
          try {
            const compressedFile = await compressImage(file);
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageUrl = event.target?.result;
              const altText =
                prompt("Enter alt text for the image:") || "Image";
              const imageHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;" />`;
              executeCommand("insertHTML", imageHtml);
            };
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            console.error("Image compression failed:", error);
            alert("Failed to process image. Please try again.");
          }
        } else {
          alert("Please select a valid image file.");
        }

        // Reset file input
        e.target.value = "";
      },
      [executeCommand, compressImage]
    );

    // Clear formatting
    const clearFormatting = useCallback(() => {
      executeCommand("removeFormat");
      executeCommand("unlink");
    }, [executeCommand]);

    // Toggle preview mode
    const togglePreview = useCallback(() => {
      setIsPreviewMode((prev) => !prev);
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
      setIsFullscreen((prev) => !prev);
    }, []);

    // Apply color
    const applyColor = useCallback(
      (color, isBackground = false) => {
        executeCommand(isBackground ? "backColor" : "foreColor", color);
        setShowColorPicker(false);
      },
      [executeCommand]
    );

    // Toolbar button component
    const ToolbarButton = ({
      onClick,
      disabled = false,
      active = false,
      title,
      children,
      className: buttonClassName = "",
    }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
        p-2 rounded-lg transition-all duration-200 border border-transparent
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
        }
        ${
          active
            ? "bg-blue-100 border-blue-300 text-blue-700 shadow-sm"
            : "text-gray-600"
        }
        ${buttonClassName}
      `}
        title={title}
        aria-label={title}
      >
        {children}
      </button>
    );

    // Separator component
    const Separator = () => (
      <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />
    );

    return (
      <div
        className={`
      ${isFullscreen ? "fixed inset-0 z-50 bg-white" : "relative"}
      ${className}
    `}
      >
        <div
          className={`
        border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm
        ${isFullscreen ? "h-full flex flex-col" : ""}
      `}
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 gap-1">
            {/* History Controls */}
            <ToolbarButton
              onClick={undo}
              disabled={isUndoDisabled}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={redo}
              disabled={isRedoDisabled}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={16} />
            </ToolbarButton>

            <Separator />

            {/* Text Formatting */}
            <select
              onChange={(e) => executeCommand("formatBlock", e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Text style"
              disabled={disabled}
              aria-label="Text formatting style"
            >
              <option value="">Format</option>
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
              <option value="blockquote">Quote</option>
              <option value="pre">Code Block</option>
            </select>

            {/* Basic Formatting */}
            <ToolbarButton
              onClick={() => executeCommand("bold")}
              active={activeFormats.has("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("italic")}
              active={activeFormats.has("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("underline")}
              active={activeFormats.has("underline")}
              title="Underline (Ctrl+U)"
            >
              <Underline size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("strikeThrough")}
              active={activeFormats.has("strikethrough")}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </ToolbarButton>

            <Separator />

            {/* Text Alignment */}
            <ToolbarButton
              onClick={() => executeCommand("justifyLeft")}
              active={activeFormats.has("alignLeft")}
              title="Align left"
            >
              <AlignLeft size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("justifyCenter")}
              active={activeFormats.has("alignCenter")}
              title="Align center"
            >
              <AlignCenter size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("justifyRight")}
              active={activeFormats.has("alignRight")}
              title="Align right"
            >
              <AlignRight size={16} />
            </ToolbarButton>

            <Separator />

            {/* Lists */}
            <ToolbarButton
              onClick={() => executeCommand("insertUnorderedList")}
              active={activeFormats.has("bulletList")}
              title="Bullet list"
            >
              <List size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => executeCommand("insertOrderedList")}
              active={activeFormats.has("numberedList")}
              title="Numbered list"
            >
              <ListOrdered size={16} />
            </ToolbarButton>

            <Separator />

            {/* Media & Links */}
            <ToolbarButton onClick={insertLink} title="Insert link (Ctrl+K)">
              <Link size={16} />
            </ToolbarButton>

            <ToolbarButton onClick={insertImage} title="Insert image">
              <ImageIcon size={16} />
            </ToolbarButton>

            <Separator />

            {/* Utility */}
            <ToolbarButton onClick={clearFormatting} title="Clear formatting">
              <RotateCcw size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={togglePreview}
              active={isPreviewMode}
              title="Toggle preview (Ctrl+Enter)"
            >
              {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </ToolbarButton>

            <ToolbarButton
              onClick={toggleFullscreen}
              active={isFullscreen}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </ToolbarButton>
          </div>

          {/* Editor Content */}
          <div
            className={`
          ${isFullscreen ? "flex-1 flex flex-col" : ""}
        `}
          >
            {isPreviewMode ? (
              <div
                className={`
                p-4 prose prose-sm max-w-none overflow-y-auto bg-gray-50
                ${isFullscreen ? "flex-1" : ""}
              `}
                style={{ height: isFullscreen ? "auto" : height }}
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <div
                ref={editorRef}
                contentEditable={!disabled}
                className={`
                p-4 outline-none text-sm leading-relaxed overflow-y-auto
                ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
                ${isFullscreen ? "flex-1" : ""}
                focus:ring-2 focus:ring-blue-500 focus:ring-inset
              `}
                style={{
                  height: isFullscreen ? "auto" : height,
                  minHeight: "150px",
                }}
                // dangerouslySetInnerHTML={{ __html: value }}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onMouseUp={updateActiveFormats}
                onKeyUp={updateActiveFormats}
                data-placeholder={placeholder}
                suppressContentEditableWarning={true}
                role="textbox"
                aria-multiline="true"
                aria-label="Rich text editor"
              />
            )}
          </div>

          {/* Status Bar */}
          {(showWordCount || maxLength) && (
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                {showWordCount && (
                  <>
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                  </>
                )}
              </div>
              {maxLength && (
                <span
                  className={
                    charCount > maxLength ? "text-red-600 font-semibold" : ""
                  }
                >
                  {charCount}/{maxLength}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Custom styles for placeholder and content */}
        <style jsx>{`
          [contenteditable] blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }

          [contenteditable] pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-family: "Courier New", monospace;
          }

          [contenteditable] hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 1rem 0;
          }

          [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
          }

          [contenteditable] a {
            color: #3b82f6;
            text-decoration: underline;
          }

          [contenteditable] a:hover {
            color: #1d4ed8;
          }
        `}</style>
      </div>
    );
  }
);

CustomTextEditor.displayName = "CustomTextEditor";

// Enhanced BlogForm Component
const BlogForm = ({ blog, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    image: null,
    tags: "",
    isPublished: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-save ref
  const autoSaveTimeoutRef = useRef(null);

  // Get user info from localStorage or API
  const getUserInfo = useCallback(async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const userName = localStorage.getItem("userName") || "Admin User";
      return { adminId, userName };
    } catch (error) {
      console.warn("Could not get user info:", error);
      return { adminId: null, userName: "Anonymous" };
    }
  }, []);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      const { userName } = await getUserInfo();

      if (blog) {
        setFormData({
          title: blog.title || "",
          content: blog.content || "",
          author: blog.author || userName,
          category: blog.category || "",
          image: blog.image || null,
          tags: blog.tags?.join(", ") || "",
          isPublished: blog.isPublished || false,
        });
        if (blog.image) setPreview(blog.image);
      } else {
        setFormData((prev) => ({
          ...prev,
          author: userName,
        }));
      }
    };

    initializeForm();
  }, [blog, getUserInfo]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [preview]);

  // Validation functions
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters long";
    } else if (formData.title.length > 200) {
      errors.title = "Title must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.replace(/<[^>]*>/g, "").length < 50) {
      errors.content = "Content must be at least 50 characters long";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    // Validate tags
    if (formData.tags) {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      if (tags.length > 10) {
        errors.tags = "Maximum 10 tags allowed";
      }
      if (tags.some((tag) => tag.length > 50)) {
        errors.tags = "Each tag must be less than 50 characters";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Auto-save functionality
  const handleAutoSave = useCallback(
    async (content) => {
      if (!isDirty || isLoading) return;

      setIsAutoSaving(true);

      try {
        // Simulate auto-save (replace with actual API call)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update local storage as backup
        const draftKey = blog ? `blog-draft-${blog._id}` : "blog-draft-new";
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            ...formData,
            content,
            lastSaved: new Date().toISOString(),
          })
        );

        setLastAutoSave(new Date());
        setSuccess("Draft saved automatically");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.warn("Auto-save failed:", error);
      } finally {
        setIsAutoSaving(false);
      }
    },
    [formData, blog, isDirty, isLoading]
  );

  // Handle form field changes
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      setIsDirty(true);

      // Clear specific validation error when user starts typing
      if (validationErrors[name]) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }

      // Clear general messages
      setError("");
      setSuccess("");
    },
    [validationErrors]
  );

  // Handle content changes from editor
  const handleContentChange = useCallback(
    (content) => {
      setFormData((prev) => ({
        ...prev,
        content: content,
      }));

      setIsDirty(true);

      if (validationErrors.content) {
        setValidationErrors((prev) => ({
          ...prev,
          content: undefined,
        }));
      }
    },
    [validationErrors.content]
  );

  // Image compression function
  const compressImage = useCallback((file, maxSize = 1024 * 1024) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          0.85 // Compression quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Handle image upload
  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, GIF)");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }

      try {
        setIsLoading(true);

        // Compress image if needed
        const compressedFile =
          file.size > 1024 * 1024 ? await compressImage(file) : file;

        // Clear previous preview if it was a blob URL
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }

        setFormData((prev) => ({ ...prev, image: compressedFile }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFile);
        setPreview(previewUrl);
        setIsDirty(true);
        setError("");
      } catch (error) {
        setError("Failed to process image. Please try again.");
        console.error("Image processing error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [preview, compressImage]
  );

  // Remove image
  const removeImage = useCallback(() => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview("");
    setFormData((prev) => ({ ...prev, image: null }));
    setIsDirty(true);
  }, [preview]);

  // Handle form submission with comprehensive error handling
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        setError("Please fix the validation errors below");
        return;
      }

      setIsLoading(true);
      setError("");
      setUploadProgress(0);

      try {
        const { adminId } = await getUserInfo();

        // Process tags
        const tagsArray = formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [];

        let imageUrl = formData.image;

        // Upload image if it's a file
        if (formData.image instanceof File || formData.image instanceof Blob) {
          const imageData = new FormData();
          imageData.append("files", formData.image);

          const uploadResponse = await api.post(
            "/upload/doc-upload",
            imageData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
              },
              timeout: 30000, // 30 second timeout
            }
          );

          if (!uploadResponse.data?.imageUrl) {
            throw new Error("Image upload failed - no URL returned");
          }

          imageUrl = uploadResponse.data.imageUrl;
        }

        // Build blog payload
        const blogPayload = {
          title: formData.title.trim(),
          content: formData.content,
          category: formData.category,
          author: adminId || formData.author,
          tags: tagsArray,
          image: imageUrl,
          isPublished: formData.isPublished,
        };

        let response;
        if (blog) {
          response = await api.put(`/blogs/update/${blog._id}`, blogPayload, {
            timeout: 15000,
          });
        } else {
          response = await api.post("/blogs/create", blogPayload, {
            timeout: 15000,
          });
        }

        if (response.data.status) {
          setSuccess(
            blog ? "Blog updated successfully!" : "Blog created successfully!"
          );
          setIsDirty(false);

          // Clear auto-save draft
          const draftKey = blog ? `blog-draft-${blog._id}` : "blog-draft-new";
          localStorage.removeItem(draftKey);

          // Call parent callback
          onSubmit(
            response.data.post || {
              ...formData,
              image: imageUrl,
              _id: blog?._id,
            }
          );
        } else {
          throw new Error(response.data.message || "Operation failed");
        }
      } catch (err) {
        console.error("Submit error:", err);

        if (err.name === "AbortError" || err.code === "ECONNABORTED") {
          setError(
            "Request timeout. Please check your connection and try again."
          );
        } else if (err.response?.status === 413) {
          setError("File too large. Please use a smaller image.");
        } else if (err.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "An unexpected error occurred"
          );
        }
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
    [formData, validateForm, getUserInfo, blog, onSubmit]
  );

  // Handle cancel with confirmation if dirty
  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [isDirty, onCancel]);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {blog ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>

        {/* Auto-save indicator */}
        <div className="flex items-center space-x-2 text-sm">
          {isAutoSaving && (
            <div className="flex items-center text-blue-600">
              <Loader2 size={14} className="animate-spin mr-1" />
              Saving...
            </div>
          )}
          {lastAutoSave && !isAutoSaving && (
            <div className="flex items-center text-green-600">
              <CheckCircle size={14} className="mr-1" />
              Saved {lastAutoSave.toLocaleTimeString()}
            </div>
          )}
          {isDirty && !isAutoSaving && !lastAutoSave && (
            <div className="flex items-center text-orange-600">
              <Clock size={14} className="mr-1" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle size={16} className="text-red-600 mr-2 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle
              size={16}
              className="text-green-600 mr-2 flex-shrink-0"
            />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Category Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`
                block w-full rounded-lg border shadow-sm p-3 text-sm transition-colors
                ${
                  validationErrors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }
              `}
              placeholder="Enter an engaging blog title..."
              disabled={isLoading}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`
                block w-full rounded-lg border shadow-sm p-3 text-sm transition-colors
                ${
                  validationErrors.category
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }
              `}
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Finance">Finance</option>
              <option value="Entertainment">Entertainment</option>
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {validationErrors.category}
              </p>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content *
          </label>
          <CustomTextEditor
            value={formData.content}
            onChange={handleContentChange}
            onAutoSave={handleAutoSave}
            placeholder="Write your blog content here... Use Ctrl+S to save draft."
            height="400px"
            disabled={isLoading}
            maxLength={50000}
            className={validationErrors.content ? "border-red-500" : ""}
          />
          {validationErrors.content && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {validationErrors.content}
            </p>
          )}
        </div>

        {/* Image and Tags Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Featured Image
            </label>

            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isLoading}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
                    aria-label="Remove image"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-48 border-2 border-dashed 
                    rounded-lg cursor-pointer transition-all
                    ${
                      isLoading
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload
                      size={32}
                      className={`mb-3 ${
                        isLoading ? "text-gray-300" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isLoading ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span className="font-semibold text-blue-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isLoading ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Tags and Publish Status */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="technology, business, trends"
                disabled={isLoading}
                className={`
                  block w-full rounded-lg border shadow-sm p-3 text-sm transition-colors
                  ${
                    validationErrors.tags
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }
                `}
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate tags with commas. Maximum 10 tags allowed.
              </p>
              {validationErrors.tags && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {validationErrors.tags}
                </p>
              )}
            </div>

            {/* Author Display */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                disabled
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600"
              />
            </div>

            {/* Publish Status */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <label
                  htmlFor="isPublished"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Publish immediately
                </label>
                <p className="text-xs text-gray-500">
                  Uncheck to save as draft
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>

          {/* Save Draft Button (when not published) */}
          {!formData.isPublished && (
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, isPublished: false }));
                handleSubmit(new Event("submit"));
              }}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Draft
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || Object.keys(validationErrors).length > 0}
            className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {blog ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                {blog
                  ? "Update Post"
                  : formData.isPublished
                  ? "Publish Post"
                  : "Save Draft"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
