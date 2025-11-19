import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { teamService } from '../services/teamService';
import { authService } from '../services/authService';

export const ApiTestPage: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const addResult = (text: string) => {
    setResults(prev => prev + '\n' + text);
    console.log(text);
  };

  const testAuth = async () => {
    setLoading(true);
    setResults('🔐 Testing Auth...\n');
    try {
      addResult('✅ Testing /auth/profile...');
      const profile = await authService.getProfile();
      addResult(`✅ Profile: ${JSON.stringify(profile, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Auth Error: ${error.message}`);
      addResult(`Details: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testProjects = async () => {
    setLoading(true);
    setResults('📁 Testing Projects...\n');
    try {
      addResult('✅ Testing GET /projects...');
      const projects = await projectService.getProjects(1, 10, '');
      addResult(`✅ Projects found: ${projects.projects.length}`);
      addResult(`Total pages: ${projects.totalPages}`);
      addResult(`Projects: ${JSON.stringify(projects.projects, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Projects Error: ${error.message}`);
      addResult(`Status: ${error.response?.status}`);
      addResult(`Details: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testTasks = async () => {
    setLoading(true);
    setResults('📝 Testing Tasks...\n');
    try {
      addResult('✅ Testing GET /tasks...');
      const tasks = await taskService.getTasks({ limit: 10 });
      addResult(`✅ Tasks found: ${tasks.tasks.length}`);
      addResult(`Total pages: ${tasks.totalPages}`);
      addResult(`Tasks: ${JSON.stringify(tasks.tasks, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Tasks Error: ${error.message}`);
      addResult(`Status: ${error.response?.status}`);
      addResult(`Details: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testTeam = async () => {
    setLoading(true);
    setResults('👥 Testing Team...\n');
    try {
      addResult('✅ Testing GET /team/members...');
      const team = await teamService.getMembers();
      addResult(`✅ Members found: ${team.members.length}`);
      addResult(`Members: ${JSON.stringify(team.members, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Team Error: ${error.message}`);
      addResult(`Status: ${error.response?.status}`);
      addResult(`Details: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testAll = async () => {
    setResults('🧪 Running All Tests...\n\n');
    await testAuth();
    await testProjects();
    await testTasks();
    await testTeam();
    addResult('\n✅ All tests completed!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">API Test</h1>

        <Card>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={testAuth} disabled={loading}>
                Test Auth
              </Button>
              <Button onClick={testProjects} disabled={loading}>
                Test Projects
              </Button>
              <Button onClick={testTasks} disabled={loading}>
                Test Tasks
              </Button>
              <Button onClick={testTeam} disabled={loading}>
                Test Team
              </Button>
              <Button onClick={testAll} disabled={loading} variant="secondary">
                Test All
              </Button>
              <Button onClick={() => setResults('')} variant="ghost">
                Clear
              </Button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
              <pre className="whitespace-pre-wrap">{results || 'Click a button to test...'}</pre>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-3">Instrucciones</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Asegúrate de estar autenticado (iniciado sesión)</p>
            <p>2. Abre la consola del navegador (F12) para ver logs detallados</p>
            <p>3. Click en "Test All" para probar todos los endpoints</p>
            <p>4. Los resultados aparecerán arriba y en la consola</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
