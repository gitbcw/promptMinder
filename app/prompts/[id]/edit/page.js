'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal"

export default function EditPrompt({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [prompt, setPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      const state = window.history.state;
      if (state?.usr?.state?.prompt) {
        return state.usr.state.prompt;
      }
    }
    return null;
  });
  const [originalVersion, setOriginalVersion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  useEffect(() => {
    if (id && !prompt) {
      fetch(`/api/prompts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPrompt(data);
          setOriginalVersion(data.version);
        })
        .catch((error) => console.error('Error fetching prompt:', error));
    } else if (prompt && originalVersion === null) {
      setOriginalVersion(prompt.version);
    }

    fetch('/api/tags')
      .then((response) => response.json())
      .then((data) => {
        setTagOptions(data.map(tag => ({ value: tag.name, label: tag.name })));
      })
      .catch((error) => console.error('Error fetching tags:', error));
  }, [id, prompt, originalVersion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isNewVersion = originalVersion !== prompt.version;
      const endpoint = isNewVersion ? '/api/prompts' : `/api/prompts/${id}`;
      const method = 'POST';

      const submitData = {
        ...prompt
      };
      if (isNewVersion) {
        delete submitData.id;
        delete submitData.created_at;
        delete submitData.updated_at;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(isNewVersion ? '新版本创建成功！' : '提示词更新成功！');
        router.push(`/prompts/${isNewVersion ? data.id : id}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || '更新失败，请重试');
      }
    } catch (error) {
      toast.error('更新失败，请重试');
      console.error('Error updating prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.content.trim()) return;
    setIsOptimizing(true);
    setOptimizedContent('');
    setShowOptimizeModal(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt.content }),
      });
      
      if (!response.ok) throw new Error('优化失败');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let tempContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const jsonStr = line.replace(/^data: /, '').trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            
            const data = JSON.parse(jsonStr);
            if (data.choices?.[0]?.delta?.content) {
              tempContent += data.choices[0].delta.content;
              setOptimizedContent(tempContent);
            }
          } catch (e) {
            console.error('解析响应数出错:', e);
          }
        }
      }

    } catch (error) {
      console.error('优化错误:', error);
      toast.error('优化失败，请重试');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimized = () => {
    setPrompt(prev => ({
      ...prev,
      content: optimizedContent
    }));
    setShowOptimizeModal(false);
    toast.success('已应用优化结果');
  };

  if (!prompt) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-3xl mx-auto p-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">编辑提示词</h1>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-medium">标题</Label>
                  <Input
                    id="title"
                    value={prompt.title}
                    onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                    className="h-12"
                    placeholder="输入提示词标题"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-lg font-medium">内容</Label>
                  <div className="relative">
                    <Textarea
                      id="content"
                      value={prompt.content}
                      onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                      className="min-h-[250px] resize-y pr-12"
                      placeholder="输入提示词内容"
                      required
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 hover:bg-primary/10"
                      onClick={handleOptimize}
                      disabled={isOptimizing || !prompt.content.trim()}
                    >
                      {isOptimizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-medium">描述</Label>
                  <Textarea
                    id="description"
                    value={prompt.description}
                    onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
                    className="min-h-[80px] resize-y"
                    placeholder="添加描述信息"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-lg font-medium">标签</Label>
                  <CreatableSelect
                    id="tags"
                    isMulti
                    value={prompt.tags?.split(',').map(tag => ({ value: tag, label: tag }))||[]}
                    onChange={(selected) => {
                      const tags = selected ? selected.map(option => option.value).join(',') : '';
                      setPrompt({ ...prompt, tags });
                    }}
                    options={tagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="选择或创建标签"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '2.5rem',
                      })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onCreateOption={async (inputValue) => {
                      try {
                        const response = await fetch('/api/tags', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ name: inputValue }),
                        });
                        
                        if (response.ok) {
                          const newOption = { value: inputValue, label: inputValue };
                          setTagOptions([...tagOptions, newOption]);
                          
                          const newTags = prompt.tags ? `${prompt.tags},${inputValue}` : inputValue;
                          setPrompt({ ...prompt, tags: newTags });
                        }
                      } catch (error) {
                        console.error('Error creating new tag:', error);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-lg font-medium">版本</Label>
                  <Input
                    id="version"
                    value={prompt.version}
                    onChange={(e) => setPrompt({ ...prompt, version: e.target.value })}
                    className="h-12"
                    placeholder="输入版本号"
                  />
                </div>
              </motion.div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-32 h-12"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      <span>保存中...</span>
                    </div>
                  ) : '保存'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="w-32 h-12"
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Modal isOpen={showOptimizeModal} onClose={() => setShowOptimizeModal(false)}>
        <ModalContent className="max-w-3xl max-h-[80vh]">
          <ModalHeader>
            <ModalTitle>优化结果预览</ModalTitle>
          </ModalHeader>
          <div className="relative min-h-[200px] max-h-[50vh] overflow-y-auto">
            <Textarea
              value={optimizedContent}
              onChange={(e) => setOptimizedContent(e.target.value)}
              className="min-h-[200px] w-full"
              placeholder="正在生成优化内容..."
            />
          </div>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOptimizeModal(false)}
              className="mr-2"
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleApplyOptimized}
              disabled={!optimizedContent.trim()}
            >
              应用优化结果
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 