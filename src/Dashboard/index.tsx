import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Repository from '../Repository';
import api from '../services/api';

import { Title, Repositories, Form } from './styles';

interface Repository {
  cep: string;
  bairro: string;
  cidade: string;
  logradouro: string;
  estado: string;
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const response = await api.get<Repository>(`${newRepo}`);
    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');
  }

  return (
    <>
      <Title>Explore o CEP</Title>

      <Form onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o número do CEP"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        {repositories.map(repository => (
          <a key={repository.cep} href="https://www.google.com/maps/@-26.5121292,-49.0918267,15z">
            <img
              src="https://lh4.googleusercontent.com/proxy/qBNPTGM73OG6l5Nu17m0swfJuChsSvEmIwsfHYX49wGYha4x8Jb2CD2P51k4_y-__1W_FS-UrSKWA31MJHXyFJGnvqX3XeN1aVmEkuBKZ__dgXezkzHrwMgK81wglxSKXLTl5Zq20bOuKRDA83xrGvs=s0-d"
              alt="Earth" />
            <div>
              <strong>Informações sobre o CEP</strong>
              <p>CEP: {repository.cep}</p>
              <p>Bairro: {repository.bairro}</p>
              <p>Cidade: {repository.cidade}</p>
              <p>Logradouro: {repository.logradouro}</p>
              <p>Estado: {repository.estado}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
