import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Button, ScrollView, StyleSheet, Alert, Platform } from 'react-native';

const BASE =
  Platform.OS === 'web'
    ? 'http://localhost:3000/todos'
    : (process.env.EXPO_PUBLIC_API_URL ?? `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}:3000`) + '/todos';

const api = (url: string, method = 'GET', data?: object) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  }).then(r => r.json());

interface Task { id: number; title: string; description: string; completed: boolean; }

export default function App() {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen]  = useState<'list' | 'detail' | 'form'>('list');
  const [current, setCurrent] = useState<Task | null>(null);
  const [title, setTitle]    = useState('');
  const [desc, setDesc]      = useState('');

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true);
    const json = await api(BASE);
    const data = json.data ?? json;
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const openDetail = async (id: number) => {
    const json = await api(`${BASE}/${id}`);
    setCurrent(json.data ?? json);
    setScreen('detail');
  };

  const openForm = (task?: Task) => {
    setCurrent(task ?? null);
    setTitle(task?.title ?? '');
    setDesc(task?.description ?? '');
    setScreen('form');
  };

  const saveTask = async () => {
    if (!title.trim()) return Alert.alert('El título es requerido');
    if (current) {
      await api(`${BASE}/${current.id}`, 'PUT', { title, description: desc, completed: current.completed });
    } else {
      await api(BASE, 'POST', { title, description: desc, completed: false });
    }
    setScreen('list');
    loadTasks();
  };

  const toggleTask = async (task: Task) => {
    await api(`${BASE}/${task.id}`, 'PUT', { ...task, completed: !task.completed });
    loadTasks();
  };

  const deleteTask = async (id: number) => {
    await api(`${BASE}/${id}`, 'DELETE');
    setTasks(tasks.filter(t => t.id !== id));
    setScreen('list');
  };

  const confirmDelete = (id: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Eliminar tarea?')) deleteTask(id);
    } else {
      Alert.alert('Eliminar', '¿Estás seguro?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteTask(id) },
      ]);
    }
  };

  if (loading) return (
    <View style={s.center}>
      <Text>Cargando...</Text>
    </View>
  );

  if (screen === 'form') return (
    <View style={s.container}>
      <Text style={s.heading}>{current ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
      <TextInput style={s.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={s.input} placeholder="Descripción (opcional)" value={desc} onChangeText={setDesc} />
      <Button title="Guardar" onPress={saveTask} />
      <Button title="Cancelar" onPress={() => setScreen(current ? 'detail' : 'list')} />
    </View>
  );

  if (screen === 'detail' && current) return (
    <View style={s.container}>
      <Button title="← Volver" onPress={() => setScreen('list')} />
      <View style={s.card}>
        <Text style={s.heading}>{current.title}</Text>
        <Text style={s.status}>{current.completed ? '✅ Completada' : '⏳ Pendiente'}</Text>
        <Text style={s.desc}>{current.description || 'Sin descripción.'}</Text>
      </View>
      <Button title="Editar" onPress={() => openForm(current)} />
      <Button title="Eliminar" color="red" onPress={() => confirmDelete(current.id)} />
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.header}>Mis Tareas</Text>
      <Button title="+ Nueva Tarea" onPress={() => openForm()} />
      <ScrollView contentContainerStyle={s.list}>
        {tasks.length === 0 && <Text style={s.empty}>Sin tareas. ¡Todo en orden!</Text>}
        {tasks.map(task => (
          <View key={task.id} style={s.row}>
            <Pressable style={[s.check, task.completed && s.checkDone]} onPress={() => toggleTask(task)}>
              <Text style={s.checkTxt}>{task.completed ? '✓' : ''}</Text>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => openDetail(task.id)}>
              <Text style={[s.title, task.completed && s.done]}>{task.title}</Text>
              {task.description ? <Text style={s.desc} numberOfLines={1}>{task.description}</Text> : null}
            </Pressable>
            <Pressable onPress={() => confirmDelete(task.id)}>
              <Text style={s.del}>✕</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#002854', padding: 20 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:    { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 16 },
  heading:   { fontSize: 22, fontWeight: '800', color: '#002854', marginBottom: 8 },
  list:      { paddingBottom: 40 },
  empty:     { textAlign: 'center', color: '#8FC4F7', marginTop: 40, fontSize: 16 },
  card:      { backgroundColor: '#FFF', borderRadius: 16, padding: 24, marginVertical: 16 },
  status:    { fontSize: 15, color: '#4F657A', marginBottom: 8 },
  row:       { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginTop: 12, alignItems: 'center' },
  check:     { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#002854', marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  checkDone: { backgroundColor: '#002854' },
  checkTxt:  { color: '#FFF', fontWeight: 'bold' },
  title:     { fontSize: 16, fontWeight: '700', color: '#002854' },
  done:      { textDecorationLine: 'line-through', color: '#6E87A0' },
  desc:      { fontSize: 13, color: '#4F657A', marginTop: 2 },
  del:       { color: '#EF4444', fontSize: 16, fontWeight: '800', padding: 8 },
  input:     { backgroundColor: '#EEF6FF', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16, color: '#002854' },
});
