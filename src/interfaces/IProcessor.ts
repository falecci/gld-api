import Employee from '../models/Employee';
import Department from '../models/Department';
import Office from '../models/Office';
import { ProcessorConfig } from '../types';

interface IProcessor<T = Employee | Department | Office> {
  process(data: T[], ...args: any[]): Promise<void>;

  setup(config: ProcessorConfig<T>): IProcessor<T>;
}

export default IProcessor;
