import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';

const cwd = process.cwd();
const renameFiles: Record<string, string | undefined> = {
	_gitignore: '.gitignore',
};
const defaultTargetDir = 'dubhe-template-project';

const init = async () => {
	const response = await prompts([
		{
			type: 'text',
			name: 'projectName',
			message: 'Input your projectName.',
			initial: defaultTargetDir,
		},
		{
			type: 'select',
			name: 'chain',
			message: 'Pick your chain.',
			choices: [
				{ title: 'sui', description: 'Sui', value: 'sui' },
				{ title: 'aptos', description: 'Aptos', value: 'aptos' },
			],
			initial: 0,
		},
		{
			type: 'select',
			name: 'platform',
			message: 'Pick your platform.',
			choices: [
				{ title: '101', description: 'Quick start', value: '101' },
				{ title: 'Web', description: 'Web template', value: 'web' },
				{
					title: 'Contract',
					description: 'Contract template',
					value: 'contract',
				},
				{
					title: 'Cocos',
					description: 'Cocos Creator',
					value: 'cocos',
				},
			],
			initial: 0,
		},
	]);
	const { projectName, chain, platform } = response;
	let target = '';

	if (platform === '101') {
		target = `template/101/${chain}-template`;
	} else if (platform === 'contract') {
		target = `template/contract/${chain}-template`;
	} else if (platform === 'web') {
		target = `template/nextjs/${chain}-template`;
	} else {
		target = `template/cocos/${chain}-template`;
	}

	let targetDir = projectName || defaultTargetDir;
	const root = path.join(cwd, targetDir);

	if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
	const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		'../..',
		target
	);

	if (!fs.existsSync(templateDir)) {
		console.error(`Template directory not found: ${templateDir}`);
		process.exit(1);
	}

	const write = (file: string, content?: string) => {
		const targetPath = path.join(root, renameFiles[file] ?? file);
		if (content) {
			fs.writeFileSync(targetPath, content);
		} else {
			try {
				copy(path.join(templateDir, file), targetPath);
			} catch (error) {
				console.error(`Error copying file ${file}:`, error);
				process.exit(1);
			}
		}
	};

	const files = fs.readdirSync(templateDir);
	for (const file of files.filter(
		f => f !== 'package.json' && f !== 'node_modules'
	)) {
		write(file);
	}

	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
	);

	pkg.name = projectName;

	write('package.json', JSON.stringify(pkg, null, 2) + '\n');

	const cdProjectName = path.relative(cwd, root);

	// Console styling
	const styles = {
		success: '\x1b[32m%s\x1b[0m', // Green
		info: '\x1b[36m%s\x1b[0m', // Cyan
		command: '\x1b[33m%s\x1b[0m', // Yellow
		separator: '\x1b[90m%s\x1b[0m', // Gray
	};

	// Enhanced visual output
	console.log('\n' + '='.repeat(60));
	console.log(styles.success, '🎉 Project creation successful!');
	console.log(styles.info, `📁 Project location: ${root}`);
	console.log(styles.separator, '-'.repeat(60));
	console.log(styles.info, 'Next steps:\n');

	if (root !== cwd) {
		console.log(
			styles.command,
			`  cd ${
				cdProjectName.includes(' ')
					? `"${cdProjectName}"`
					: cdProjectName
			}`
		);
	}

	// Platform specific commands
	switch (platform) {
		case '101':
		case 'web':
			console.log(styles.command, `  ${pkgManager} install`);
			console.log(styles.command, `  ${pkgManager} run start:localnet`);
			console.log(styles.command, `  ${pkgManager} run dev`);
			break;
		case 'contract':
			console.log(styles.command, `  ${pkgManager} install`);
			break;
		case 'cocos':
			console.log(styles.command, `  import project by cocos create ide`);
			console.log(styles.command, `  ${pkgManager} install`);
			console.log(styles.command, `  ${pkgManager} run dev`);
			console.log(styles.command, `  start your cocos project`);
			break;
	}

	console.log(styles.separator, '\n' + '='.repeat(60) + '\n');
};

function copy(src: string, dest: string) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}

function copyDir(srcDir: string, destDir: string) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}

function pkgFromUserAgent(userAgent: string | undefined) {
	if (!userAgent) return undefined;
	const pkgSpec = userAgent.split(' ')[0];
	const pkgSpecArr = pkgSpec.split('/');
	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
}

init().catch(e => {
	console.error(e);
});
