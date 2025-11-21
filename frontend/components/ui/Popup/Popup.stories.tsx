import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popup } from './Popup';

const meta: Meta<typeof Popup> = {
  title: 'UI/Popup',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popup>;

export const Small: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<Element | null>(
      null,
    );

    return (
      <div>
        <button
          ref={(el) => setReferenceElement(el)}
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Small Popup を開く
        </button>
        <Popup
          isOpen={isOpen}
          referenceElement={referenceElement}
          onClose={() => setIsOpen(false)}
          size="small"
        >
          <div className="p-4">
            <h3 className="font-bold mb-2">Small サイズ</h3>
            <p className="text-sm">小さいポップアップです</p>
          </div>
        </Popup>
      </div>
    );
  },
};

export const Medium: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<Element | null>(
      null,
    );

    return (
      <div>
        <button
          ref={(el) => setReferenceElement(el)}
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Medium Popup を開く
        </button>
        <Popup
          isOpen={isOpen}
          referenceElement={referenceElement}
          onClose={() => setIsOpen(false)}
          size="medium"
        >
          <div className="p-4">
            <h3 className="font-bold mb-2">Medium サイズ</h3>
            <p className="text-sm mb-4">標準サイズのポップアップです</p>
            <div className="space-y-2">
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="入力例"
              />
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                決定
              </button>
            </div>
          </div>
        </Popup>
      </div>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<Element | null>(
      null,
    );

    return (
      <div>
        <button
          ref={(el) => setReferenceElement(el)}
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Large Popup を開く
        </button>
        <Popup
          isOpen={isOpen}
          referenceElement={referenceElement}
          onClose={() => setIsOpen(false)}
          size="large"
        >
          <div className="p-4">
            <h3 className="font-bold mb-2">Large サイズ</h3>
            <p className="text-sm mb-4">
              大きいポップアップです。チャートやグラフを表示するのに適しています。
            </p>
            <div className="border rounded p-4 mb-4 h-48 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">グラフやチャートエリア</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
                保存
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </Popup>
      </div>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<Element | null>(
      null,
    );

    return (
      <div>
        <button
          ref={(el) => setReferenceElement(el)}
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          フォームを開く
        </button>
        <Popup
          isOpen={isOpen}
          referenceElement={referenceElement}
          onClose={() => setIsOpen(false)}
          size="medium"
        >
          <div className="p-4">
            <h3 className="font-bold mb-4">クイック編集</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="タイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">説明</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="説明を入力"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </Popup>
      </div>
    );
  },
};
