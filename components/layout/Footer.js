import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* 品牌区域 */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 [-webkit-background-clip:text] [background-clip:text] text-transparent">
                PromptMinder
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-6">
              让AI提示词管理变得更简单、更高效。打造你的专属提示词库，提升AI对话效率。
            </p>
            <div className="flex space-x-6">
              <Link href="https://github.com/aircrushin/promptMinder" target="_blank" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="mailto:ultrav0229@gmail.com" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 导航链接区域 */}
          <div className="mt-12 grid grid-cols-2 gap-20 xl:mt-0 xl:col-span-2 justify-self-end">
            <div className="md:grid md:grid-cols-2 md:gap-12 ">
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">产品</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                      隐私政策
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                      使用条款
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0 text-left">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">支持</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="https://prompt-minder.canny.io/feature-requests" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                      功能反馈
                    </Link>
                  </li>
                  <li>
                    <Link href="https://prompt-minder.canny.io/changelog" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                      更新日志
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">友情链接</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="https://code.promptate.xyz/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                    PromptCoder - 代码提示词
                  </Link>
                </li>
                <li>
                  <Link href="https://www.promptingguide.ai/zh" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                    PromptGuide - 提示词指南
                  </Link>
                </li>
                <li>
                  <Link href="https://www.aishort.top/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                    AIshort - 优秀 Prompt 集合
                  </Link>
                </li>
                <li>
                  <Link href="https://www.promptate.xyz/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
                    Promptate - Prompt生成器
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-4 pt-8 border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} PromptMinder. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
} 