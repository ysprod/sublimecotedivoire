'use client';
import * as React from 'react';
import { Space, Modal, Form, InputNumber, Button } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Filtre } from '@/lib/libs/interface';
import { defaultFiltre } from '@/lib/libs/constants';

interface Props {
    isFilterModalOpen: boolean;
    setIsFilterModalOpen: (value: boolean) => void;
    setFilters: React.Dispatch<React.SetStateAction<Filtre>>
}

const CarteStatForm: React.FC<Props> = ({ isFilterModalOpen, setIsFilterModalOpen, setFilters }) => {
    const [form] = Form.useForm();

    const handleFilterSubmit = (values: Filtre) => {
        setFilters({
            minTotal: values.minTotal || 0,
            maxTotal: values.maxTotal || Infinity,
            minInscription: values.minInscription || 0,
            maxInscription: values.maxInscription || Infinity,
            minRadiation: values.minRadiation || 0,
            maxRadiation: values.maxRadiation || Infinity,
            minRectification: values.minRectification || 0,
            maxRectification: values.maxRectification || Infinity,
        });
        setIsFilterModalOpen(false);
    };

    const resetFilters = () => {
        setFilters(defaultFiltre);
        form.resetFields();
    };

    return (
        <Modal
            title="Filtres avancés" open={isFilterModalOpen}
            onCancel={() => setIsFilterModalOpen(false)}
            footer={[
                <Button key="reset" onClick={resetFilters}>
                    Réinitialiser
                </Button>,
                <Button key="cancel" onClick={() => setIsFilterModalOpen(false)}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Appliquer
                </Button>,
            ]}
        >
            <Form form={form} onFinish={handleFilterSubmit} layout="vertical">
                <Form.Item label="Total" name="total">
                    <Space>
                        <Form.Item name="minTotal" noStyle>
                            <InputNumber placeholder="Min" min={0} />
                        </Form.Item>
                        <Form.Item name="maxTotal" noStyle>
                            <InputNumber placeholder="Max" min={0} />
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label="Hotel" name="inscription">
                    <Space>
                        <Form.Item name="minInscription" noStyle>
                            <InputNumber placeholder="Min" min={0} />
                        </Form.Item>
                        <Form.Item name="maxInscription" noStyle>
                            <InputNumber placeholder="Max" min={0} />
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label="Residence" name="radiation">
                    <Space>
                        <Form.Item name="minRadiation" noStyle>
                            <InputNumber placeholder="Min" min={0} />
                        </Form.Item>
                        <Form.Item name="maxRadiation" noStyle>
                            <InputNumber placeholder="Max" min={0} />
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label="Maisons hotes" name="rectification">
                    <Space>
                        <Form.Item name="minRectification" noStyle>
                            <InputNumber placeholder="Min" min={0} />
                        </Form.Item>
                        <Form.Item name="maxRectification" noStyle>
                            <InputNumber placeholder="Max" min={0} />
                        </Form.Item>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(CarteStatForm);