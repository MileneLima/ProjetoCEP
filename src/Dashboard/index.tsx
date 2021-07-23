import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Repository from '../Repository';
import api from '../services/api';

import { Title, Repositories, Form, Error } from './styles';

interface Repository {
  cep: string;
  bairro: string;
  cidade: string;
  logradouro: string;
  estado: string;
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setinputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const strorageRepository = localStorage.getItem(
    '@CepExplorer:repositories',
  );

  if (strorageRepository) {
    return JSON.parse(strorageRepository);
  }

  return [];
});

  useEffect(() => {
    localStorage.setItem(
      '@CepExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

async function handleAddRepository(
  event: FormEvent<HTMLFormElement>,
): Promise<void> {
  event.preventDefault();

  if (!newRepo) {
    setinputError('Digite um CEP válido.');
    return;
  }

  try {
    const response = await api.get<Repository>(`https://api.postmon.com.br/v1/cep/${newRepo}`);
    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');
    setinputError('');
  } catch (err) {
    setinputError('CEP não encontrado ou inexistente');
  }
}

return (
  <>
    <Title>Explore o CEP</Title>

    <Form hasError={!!inputError} onSubmit={handleAddRepository}>
      <input
        value={newRepo}
        onChange={e => setNewRepo(e.target.value)}
        type="text"
        placeholder="Digite o número do CEP"
      />
      <button type="submit">Pesquisar</button>
    </Form>

    {inputError && <Error>{inputError}</Error>}

    <Repositories>
      {repositories.map(repository => (
        <Link key={repository.cep} to={`/repository/${repository.cep}`}>
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
        </Link>
      ))}
    </Repositories>
  </>
);
};

export default Dashboard;
