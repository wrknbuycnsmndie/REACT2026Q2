import { useAppDispatch } from '../../app/hooks';
import { Modal } from '../../components/Modal/Modal';
import { addSubmission } from '../submissions/submissionsSlice';
import type { FormSource } from '../submissions/submissionTypes';
import type { FormValues } from './formTypes';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';

interface FormModalProps {
  formType: FormSource;
  onClose: () => void;
}

const formTitles: Record<FormSource, string> = {
  uncontrolled: 'Uncontrolled form',
  'react-hook-form': 'React Hook Form',
};

export function FormModal({ formType, onClose }: FormModalProps) {
  const dispatch = useAppDispatch();

  function handleSubmit(values: FormValues) {
    dispatch(
      addSubmission({
        id: crypto.randomUUID(),
        source: formType,
        submittedAt: new Date().toISOString(),
        name: values.name,
        age: values.age,
        email: values.email,
        gender: values.gender,
        acceptedTerms: values.acceptedTerms,
        country: values.country,
        image: values.image,
      }),
    );
    onClose();
  }

  return (
    <Modal title={formTitles[formType]} onClose={onClose}>
      {formType === 'uncontrolled' ? (
        <UncontrolledForm onSubmit={handleSubmit} />
      ) : (
        <HookForm onSubmit={handleSubmit} />
      )}
    </Modal>
  );
}
